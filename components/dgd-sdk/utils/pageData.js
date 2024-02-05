const pageData = {
  // 获取其他页面data里的参数。默认获取前一个页面里的data.params
  getPrevPageData(index = 2, params = 'params') {
    console.log(params)
    console.log(pages)
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - index];
    if(prevPage){
      const reslut = prevPage.data[params] || '';
      return reslut;
    }

  }
};
module.exports = pageData;