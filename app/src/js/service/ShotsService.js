/**
 * Created by guoyang on 2016/11/6.
 */
//用于获取Drrible中shots信息
angular.module("myApp")
    .factory("Base",[function () {
        return{
            url:"https://api.dribbble.com/v1",
            suffix:"?t="+new Date().getTime(),
        }
    }])
    .factory("ShotsService", ["Base","$http", function (Base,$http) {
        var service={
            //获得默认格式的shots
            params:{
                "page":1,
                "per_page":30,
                "t":new Date().getTime()
            },
            getShots: function () {
                return $http({
                    method:'GET',
                    url:Base.url+'/shots',
                    params:service.params
                });
            },
            //获得特定shot
            getAShot: function (shotId) {
                return $http.get(Base.url+"/shots/" + shotId);
            },
            //

        }
        return service;
    }])
    .factory("UserService", ["Base","$http", function (Base,$http) {
        //    获取用户信息
        return {
            //当前用户信息
            getMyself: function () {
                return $http.get(Base.url+"/user");
            },
            //其他用户信息
            getAUser: function (userId) {
                return $http.get(Base.url+"/users/" + userId);
            },
            getUserShots:function (userId) {
                return $http.get(Base.url+"/users/"+userId+"/shots");
            }

        }
    }])
    .factory("LoadingService", [function () {
        var isLoading = true;
        return {
            isLoad: function () {
                return isLoading;
            },
            setLoad: function (flag) {
                isLoading = flag;
            }
        }
    }])
    //判断已授权用户对shot的like属性
    .factory("LikedService", ["Base","$http", "$q",function (Base,$http,$q) {
        // likesList (Array)
        var service={
            likesList:[],
            init:function () {
                return service.getLikeShots();
            },
            getLikeShots:function () {
                var deferred=$q.defer();
                $http.get(Base.url+"/user/likes"+Base.suffix).then(function (success) {
                    deferred.resolve(success);
                },function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            addLikeShot:function (shotId) {
                service.likesList.push(shotId);
                console.log("like")
                return $http.post(Base.url+"/shots/"+shotId+"/like",null);
            },
            removeLikeShot:function (shotId) {
                var index=service.likesList.indexOf(shotId);
                service.likesList.splice(index,1);
                console.log("unlike")
                return $http.delete(Base.url+"/shots/"+shotId+"/like");
            },
            isLikeShot:function (shotId) {
                if(service.likesList.indexOf(shotId)!=-1){
                    return true;
                }
                else
                    return false;
            },
            toggleLike:function (shot) {
                if(service.isLikeShot(shot.id)){
                    service.removeLikeShot(shot.id);
                    shot["likes_count"]-=1;
                    console.log('unlike');
                }
                else{
                    service.addLikeShot(shot.id);
                    shot["likes_count"]+=1;
                    console.log('like');
                }
            }
        }
        return service;
    }])
    .factory("FormatService", [function () {
        return {
            formatTime:function (past) {
                //获取当前时间
                var curDate=new Date();
                var pastDate=new Date(past.toString());

                var diffSeconds=curDate-pastDate;
                //相差天数
                var day=Math.floor(diffSeconds/(24*3600*1000));
                //相差小时数
                var hour=Math.floor(diffSeconds/(3600*1000));

                var minute=Math.floor(diffSeconds/(60*1000));
                if (day>=0){
                    return pastDate.toDateString();
                }else if(hour>=0){
                    return "about "+hour+" hours ago";
                }else if(minute>=0){
                    return "about "+minute+" minute ago";
                }
                else {
                    return "1 minutes ago";
                }
            }
        }
    }])



