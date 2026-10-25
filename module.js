import {F,S,R,C,rows,byId,required,minor,amount,unique,changed,immutable,summary} from './core/rules.js';

const states=S('status','Состояние',[['draft','Черновик'],['published','Опубликован']]);
const checked=[F('checkedAt','Проверено','datetime'),F('validHours','Срок свежести, часов','integer',{min:1,max:168}),F('source','Источник сведений','url')];
export function createDefinition({now=()=>Date.now()}={}) {
 const fresh=r=>{const t=Date.parse(r.checkedAt),age=now()-t;return age>=0&&age<r.validHours*3600000;};
 return {
  slug:'qor-stock',reference:2,title:'QorStock',
  description:'Наличие товара и доставка по свежим данным: предварительная оценка или запрос оператору с сохранённым снимком.',
  limitations:'Ручной каталог · Только KZT · Без резерва, оплаты, AI и подключения к складу',
  collections:[
   C('items','Товары',[F('sku','Артикул'),F('name','Товар'),F('variant','Вариант'),F('price','Цена, KZT','money'),F('stock','Остаток, шт.','integer',{min:0,max:100000}),...checked,states],{writeRole:'admin',publicLinks:true,labelField:'name'}),
   C('zones','Доставка',[F('name','Зона доставки'),F('fee','Доставка, KZT','money'),F('minimum','Минимум товаров, KZT','money'),F('days','Ориентир, дней','integer',{min:1,max:30}),...checked,states],{writeRole:'admin'}),
   C('checks','Запросы',[R('item','Товар','items',{readOnly:true}),R('zone','Зона доставки','zones',{readOnly:true}),F('quantity','Количество','integer',{min:1,max:100000,readOnly:true}),S('status','Обработка',[['new','Новый'],['reviewed','Проверен сотрудником'],['closed','Закрыт']]),F('note','Примечание сотрудника','textarea',{required:false})])
  ],
  normalizeRow(key,row,state,old){
   if(key!=='checks')return row;
   if(old)return {...row,result:old.result,snapshot:old.snapshot};
   const item=byId(state,'items',row.item),zone=byId(state,'zones',row.zone);
   required(!item.archived&&item.status==='published','Товар закрыт для новых запросов.');
   required(!zone.archived&&zone.status==='published','Зона закрыта для новых запросов.');
   required(row.status==='new','Новый запрос начинает обработку со статуса «Новый».');
   const subtotal=minor(item.price)*row.quantity,fee=minor(zone.fee),total=subtotal+fee;
   required(Number.isSafeInteger(total),'Итог слишком велик.');
   const reasons=[];
   if(!fresh(item))reasons.push('Сведения о цене и наличии устарели или датированы будущим.');
   if(!fresh(zone))reasons.push('Условия доставки требуют повторной проверки.');
   if(row.quantity>item.stock)reasons.push('Запрошено больше указанного остатка.');
   if(subtotal<minor(zone.minimum))reasons.push('Сумма товаров ниже минимума зоны.');
   const pick=(r,keys)=>Object.fromEntries(keys.map(k=>[k,r[k]]));
   return {...row,result:{kind:reasons.length?'operator':'estimate',total:reasons.length?null:total,subtotal:reasons.length?null:subtotal,fee:reasons.length?null:fee,reasons},snapshot:{at:new Date(now()).toISOString(),currency:'KZT',item:pick(item,['sku','name','variant','price','stock','checkedAt','validHours','source']),zone:pick(zone,['name','fee','minimum','days','checkedAt','validHours','source'])}};
  },
  validate(state,before,command){
   unique(rows(state,'items'),'sku','Артикул');unique(rows(state,'zones'),'name','Зона');
   for(const key of ['items','zones'])for(const r of rows(state,key)){
    const old=changed(before,key,r.id);
    if(!old||old.checkedAt!==r.checkedAt)required(Date.parse(r.checkedAt)<=now(),'Время проверки не может быть в будущем.');
   }
   for(const q of rows(state,'checks')){
    byId(state,'items',q.item);byId(state,'zones',q.zone);
    const old=changed(before,'checks',q.id);
    if(old)immutable(old,q,['item','zone','quantity','result','snapshot'],'Поля исходного запроса и снимок неизменны. Создайте новый запрос.');
    required(q.snapshot?.currency==='KZT'&&Number.isFinite(Date.parse(q.snapshot?.at)),'Неверный снимок запроса.');
    required(['estimate','operator'].includes(q.result?.kind)&&Array.isArray(q.result.reasons),'Неверный результат запроса.');
    const r=q.result,s=q.snapshot;
    if(r.kind==='estimate'){
     const subtotal=minor(s.item.price)*q.quantity,fee=minor(s.zone.fee);
     required(r.reasons.length===0&&r.subtotal===subtotal&&r.fee===fee&&r.total===subtotal+fee&&q.quantity<=s.item.stock&&subtotal>=minor(s.zone.minimum),'Сумма не соответствует снимку.');
    }else required(r.total===null&&r.subtotal===null&&r.fee===null&&r.reasons.length>0,'Уточнение не должно обещать сумму.');
   }
  },
  summarize(state){return rows(state,'checks').map(q=>summary(q.snapshot.item.name+' · '+q.snapshot.item.variant,q.result.kind==='estimate'?'Предварительно: '+amount(q.result.total)+' KZT':'Нужна проверка оператора',q.result.reasons.join(' '),'Количество: '+q.quantity+' · '+q.snapshot.zone.name,'Остаток не зарезервирован. Это не заказ.'));},
  publicForm(state,id){
   const item=rows(state,'items').find(x=>x.id===id&&!x.archived&&x.status==='published');
   const zones=rows(state,'zones').filter(x=>!x.archived&&x.status==='published');
   return item&&zones.length?{title:item.name+' · '+item.variant,description:'Укажите количество и зону. Проверим свежесть цены, остатка и доставки. Это не резерв и не заказ. Если данных недостаточно, сохраним запрос для ручной проверки.',fields:[{key:'quantity',label:'Количество',type:'number',min:1,max:100000},{key:'zone',label:'Зона доставки',type:'select',options:zones.map(z=>({value:z.id,label:z.name}))}]}:null;
  },
  publicCommand(state,id,input){return {collection:'checks',data:{item:id,zone:input.zone,quantity:input.quantity,status:'new',note:''}};},
  publicReceipt(row){return {kind:row.result.kind,quantity:row.quantity,total:row.result.total===null?null:amount(row.result.total),subtotal:row.result.subtotal===null?null:amount(row.result.subtotal),fee:row.result.fee===null?null:amount(row.result.fee),currency:'KZT',reasons:row.result.reasons,snapshot:row.snapshot,note:'Предварительно, без резерва товара и обещания доставки. Для уточнения передайте номер запроса сотруднику магазина отдельно.'};}
 };
}
export default createDefinition();
