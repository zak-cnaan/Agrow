angular.module('myapp.controllers', [])

    .controller('TeamCtrl', function($scope, $stateParams, $state, TeamDBops) {
        var Team = TeamDBops; // too lazt to change it all
        $scope.team = [];
        $scope.team = null;
        $scope.item = {};

        $scope.updateTeam = function() {
            $scope.team = [];
            $scope.item = {};

                Team.all(["team"]).then(function (team) {
                    $scope.team = team;
                });
        }

        $scope.updateTeam();

        $scope.findOne = function() {
            var id = $stateParams.id;
            if (id) {
            Team.get(id).then(function(item){
                $scope.item = item;
            });
            };

        }



        var confirmDelete = function(confirmation){
            return confirmation ? confirm('This action is irreversible. Do you want to delete this contact?') : true;
        };

        $scope.removeMember = function(id) {
            confirmation = (typeof confirmation !== 'undefined') ? confirmation : true;
            if (confirmDelete(confirmation)) {
                Team.remove(id);
                $scope.updateTeam();
            }
        };

        $scope.create = function(member) {
            Team.add(member);
            $scope.updateTeam();
        };

        $scope.update = function(origMember, editMember) {
            Team.update(origMember, editMember);
            $scope.updateTeam();
        };

        $scope.save = function(item){
            if(typeof item.id !== 'undefined'){
                $scope.update(item);
            } else {
                $scope.create(item);
            }
            $state.go('team-index');
            $scope.item = {};
        };

    });