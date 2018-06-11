function Upload($scope, $element, $attrs, $sce) {
  function setTrustAndShowIframe (url) {
    // Note that for loading the embedded Wistia player we need to do this &&
    // config $sceDelegateProvider in app.js
    $sce.trustAsResourceUrl(url);
    $scope.url = url;
    $scope.showIframe = true;
  }

  // Sane defaults
  $scope.uploadProgress = 0.00;
  $scope.showIframe = false;
  $scope.showUploadProgress = false;
  $scope.url = "";

  $scope.options = {
    // assuming that actual application has session authentication / saner way of storing config values
    // TODO
    url: 'https://upload.wistia.com?api_password=4deb4a565bd491b1b070342f1c5a6da4c900adebe5e168f23c4d82e7d16fc102',
    //note component currently uploads a single file at a time
    //     could also configure such that file is staged with secondary "confirm upload" step triggered on form submit
    autoUpload: true
  }

  $scope.$on('fileuploadadd', function (e, data) {
    // hide embed player on new file upload until we have a new embed URL
    $scope.showIframe = false;
  });

  $scope.$on('fileuploadprogress', function (e, data) {
    $scope.uploadProgress = data.loaded / data.total * 100;
  });

  $scope.$on('fileuploadstart', function (e, data) {
    // triggered as soon as file is added since autoupload is true
    $scope.showUploadProgress = true;
  });

  $scope.$on('fileuploaddone', function (e, data) {
    var wistiaResponse = data.result,
        embedUrl = "https://fast.wistia.net/embed/iframe/" + wistiaResponse.hashed_id;

    if (!wistiaResponse.hashed_id) {
      // TODO: Better error states
      $scope.fileUploadStatusColor = 'background-color: #f702024d';
      alert('Error uploading & embedding video');
      return;
    }

    data.scope.clear(data.files);

    $scope.showUploadProgress = false;

    // TODO: Currently Wistia has to do server side processing before embedded video is viewable
    //       Check if API supports querying video processing state
    setTrustAndShowIframe(embedUrl)
  });
}

angular
  .module('app', ['blueimp.fileupload'])
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://fast.wistia.net/embed/iframe/**',
      'https://fast.wistia.net/embed/iframe/**'
    ]);
  });

angular
  .module('app')
  .controller('Upload', Upload);

angular
  .module('app')
  .component('app', {
    templateUrl : 'app.html',
    controller  : function () {}
  });

angular
  .module('app')
  .component('headerComponent', {
    templateUrl : 'header.html',
    controller  : function () {}
  });

angular
  .module('app')
  .component('main', {
    templateUrl : 'main.html',
    controller  : function () {}
  });

angular
  .module('app')
  .component('uploadComponent', {
    templateUrl : 'upload.html',
    controller  : Upload
  })
