export const isStringBlank = ( value: string ) => {
  return !value || !value.toString().trim() || /^[\s\b\0]+$/.test(value.toString());
}

export const isEmpty = ( value:any ) => {
  return ( value === null || value === undefined || value === '')
}

export const isValuesEmpty = ( values:any ) => {
  let result = false;
  for(let key in values){
      if( isEmpty(values[key]) ){
          result=true
      }
  }
  return result;
}