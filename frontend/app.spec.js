describe('Upload Controller Unit Tests', function () {

  var $controller, $scope;

  beforeEach(module('app'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controller = Upload($scope, {}, {}, { 'trustAsResourceUrl' : function () {
      $scope.mockResourceTrusted = true;
    }});
  }));

  it('hides iframe on addition of new file', function () {
    expect($scope.showIframe).toBe(false);

    $scope.showIframe = true;

    expect($scope.showIframe).toBe(true);

    $scope.$emit('fileuploadadd', {});

    expect($scope.showIframe).toBe(false);
  });

  it('correctly calculates upload progress', function () {
    expect($scope.uploadProgress).toEqual(0);

    $scope.$emit('fileuploadprogress', {loaded: 25, total: 100});

    expect($scope.uploadProgress).toEqual(25);

    $scope.$emit('fileuploadprogress', {loaded: 100, total: 100});

    expect($scope.uploadProgress).toEqual(100);
  });

  it('displays the progress bar when an upload is started', function() {
    expect($scope.showUploadProgress).toBe(false);

    $scope.$emit('fileuploadstart', {});

    expect($scope.showUploadProgress).toBe(true);
  });

  it('correctly sets the iframe URL and shows the iframe after upload to Wistia completes', function () {
    var mockData = {
      'result' : { 'hashed_id' : 'TEST_HASH_ID' },
      'scope' : {
        clear : function () {
          $scope.mockUploadListCleared = true
        },
      }
    }

    expect($scope.mockResourceTrusted).toBe(undefined);
    expect($scope.mockUploadListCleared).toBe(undefined);
    expect($scope.showIframe).toBe(false);

    $scope.$emit('fileuploaddone', mockData);

    expect($scope.mockResourceTrusted).toBe(true);
    expect($scope.showIframe).toBe(true);
    expect($scope.mockUploadListCleared).toBe(true);

    expect($scope.url).toEqual('https://fast.wistia.net/embed/iframe/' + mockData.result.hashed_id);
  });

});
