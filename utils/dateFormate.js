/**
 * 
 * @param { }data
    日期格式转换 转换成2019-12-12  
 */
function date_01 (date) {
    var nowdate = new Date(date).toLocaleDateString().replace(/\//g, '-')
    return nowdate
    }
    /**
     * 日期格式转换 转换成2019/12/12
     */
function date_02 (date) {
    var nowdate = new Date(date).toLocaleDateString()
    return nowdate
    }

    /**
     * 日期格式转换成 2019年12月12日
     */
    function getDate() {
        var now = new Date(),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        return y + "-" + m + "-" + d + " " + now.toTimeString().substr(0, 8);
}
module.exports={
    date_01,
    date_02,
    getDate

}