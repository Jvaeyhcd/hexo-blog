module.exports = function (hexo) {

  function getPostPhotos(htmlstr) {
    var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
    var imgsrcArr = [];
    while (tem = reg.exec(htmlstr)) {
      imgsrcArr.push(tem[2]);
    }
    if (imgsrcArr.length > 0) {
      return imgsrcArr[0]
    }
    return '';
  }

  hexo.extend.helper.register('has_photo', function (post) {
    var photo = getPostPhotos(post.content)
    if (photo != '') {
      return true
    } else {
      return false
    }
  })

  hexo.extend.helper.register('get_postCover', function (htmlstr) {
    return getPostPhotos(htmlstr)
  })
}
