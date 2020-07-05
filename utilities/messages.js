const moment=require('moment');
function format(username,text){
    return{
        username,
        text,
        time:moment().format('h:m a')
    }
}

module.exports=format;