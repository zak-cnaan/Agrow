angular.module('myapp.services', [])

    .factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
        var self = this;

        // Handle query's and potential errors
        self.query = function (query, parameters) {
            parameters = parameters || [];
            var q = $q.defer();

            $ionicPlatform.ready(function () {
                $cordovaSQLite.execute(db, query, parameters)
                    .then(function (result) {
                        q.resolve(result);
                    }, function (error) {
                        console.warn('I found an error');
                        console.warn(error);
                        q.reject(error);
                    });
            });
            return q.promise;
        }

        // Proces a result set
        self.getAll = function(result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
        }

        // Proces a single result
        self.getById = function(result) {
            var output = null;
            output = angular.copy(result.rows.item(0));
            return output;
        }

        return self;
    })

    .factory('TeamDBops', function($cordovaSQLite, DBA, DBops) {
        var self = this;
        var T = "team"; // table name

        self.all = function () {
            return DBops.all(T);
        }
        self.get = function(memberId) {
            return DBops.get(memberId, T);
        }
        self.add = function(member){
            return DBops.add(member, T);
        }
        self.update = function(editMember){
            return DBops.update(editMember, T);
        }
        self.remove = function(id) {
            return DBops.remove(id, T);
        }
        return self;
    })

    .factory('DBops', function($cordovaSQLite, DBA) {
        var self = this;

        self.all = function(T) {
            return DBA.query("SELECT id, name FROM " + T)
                .then(function(result){
                    return DBA.getAll(result);
                });
        }

        self.get = function(memberId, T) {
            var parameters = [memberId];
            return DBA.query("SELECT id, name FROM "+T+" WHERE id = (?)", parameters)
                .then(function(result) {
                    return DBA.getById(result);
                });
        }

        self.add = function(member, T) {
            if (!member.id)
                member.id = self.all().length + 1;
            var parameters = [member.id, member.name];
            return DBA.query("INSERT INTO "+T+" (id, name) VALUES (?,?)", parameters);
        }

        self.update = function(/*origMember, */editMember, T) {
            var parameters = [editMember.id, editMember.name, editMember.id/*, origMember.id*/];
            return DBA.query("UPDATE "+T+" SET id = (?), name = (?) WHERE id = (?)", parameters);
        }

        self.remove = function(id, T) {
            var parameters = [id];
            return DBA.query("DELETE FROM "+T+" WHERE id = (?)", parameters);
        }



        return self;
    });