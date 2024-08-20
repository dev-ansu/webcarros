export const getISODateTime = (locale: string = 'pt-br', time: boolean = false, options?: Intl.DateTimeFormatOptions):string=>{
    const newOptions: Intl.DateTimeFormatOptions = {...options, dateStyle:"short"};
    const date = (new Date).toLocaleDateString(locale, newOptions).split("/").reverse().join("-");
    if(time){
        const now = (new Date()).toLocaleTimeString('pt-br', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'});
        return `${date} ${now}`
    }
    return date;
}