export const defaultUnits={bodyWeight:'lb',solid:'lb',liquid:'l',cooking:'cup'};
export const kgToLb=(kg:number)=>kg*2.2046226218;
export const estimateWeightTimeline=(currentKg:number,goalKg:number,paceLbPerWeek:number)=>{const diff=Math.abs(kgToLb(currentKg-goalKg));if(!diff)return null;const w=diff/(paceLbPerWeek||1);return {weeksMin:Math.ceil(w*.85),weeksMax:Math.ceil(w*1.25),diffLb:diff};};
