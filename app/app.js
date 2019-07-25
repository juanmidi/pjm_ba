var app = angular.module('myApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngAnimate', 'ngSanitize']);

//constantes
app.constant('OPTIONS', {
  campos_obligatorios: true,
  bobo: 2,
  totalcomisiones: 30
})


app.config(['$locationProvider','$routeProvider', 
  function ($locationProvider, $routeProvider ) {
    $locationProvider.hashPrefix('');
    $routeProvider
      .when('/', {
        title: 'Ingresar',
        templateUrl: 'partials/inicio.html',
        controller: 'inicioCtrl'
      })
      .when('/inicio', {
        title: 'Ingresar',
        templateUrl: 'partials/inicio.html',
        controller: 'inicioCtrl'
      })
      .when('/login', {
        title: 'Ingresar',
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl'
      })
      .when('/register', {
        title: 'Registrase',
        templateUrl: 'partials/register.html',
        controller: 'registrarseCtrl',
        resolve:{
          regiones: function (services) {
              return services.getRegiones();
            }
        }
      })
      .when('/alumnos', {
        title: 'Alumnos',
        templateUrl: 'partials/alumnos.html',
        controller: 'listarAlumnosCtrl'
      })
      .when('/comisiones/:id', {
        title: 'Ver Comisión',
        templateUrl: 'partials/comisiones.html',
        controller: 'verComisionesCtrl'
      })
      .when('/estadisticas/:vuelta', {
        title: 'Estadísticas',
        templateUrl: 'partials/estadisticas.html',
        controller: 'estadisticasCtrl'
      })
      .when('/votar/:id/vuelta/:vuelta', {
        title: 'Votar',
        templateUrl: 'partials/votar.html',
        controller: 'votarCtrl'
      })
      .when('/cronograma', {
        title: 'Cronograma',
        templateUrl: 'partials/cronograma.html',
        controller: 'cronogramaCtrl'
      })
      .when('/guia_trabajo', {
        title: 'Guía de trabajo en comisión',
        templateUrl: 'partials/guia_trabajo.html',
        controller: 'guiaTrabajoCtrl'
      })
      .when('/notificaciones', {
        title: 'Notificaciones',
        templateUrl: 'partials/notificaciones.html',
        controller: 'notificacionesCtrl'
      })
      .when('/morosos/:mes', {
        title: 'Morosos',
        templateUrl: 'partials/morosos.html',
        controller: 'morososCtrl'
      })
      .when('/notamoroso/:AlumnoID/mes/:mes', {
        title: 'Nota a Moroso',
        templateUrl: 'partials/notamoroso.html',
        controller: 'notaMorosoCtrl',
        resolve: {
          deuda: function(services, $route){
            var AlumnoID = $route.current.params.AlumnoID;
            var mes = $route.current.params.mes;
            return services.notaMoroso(AlumnoID, mes);  
          },
          sistema: function(services){
            return services.getDatosSistema();  
          }
        }
      })
      .when('/edit-alumno/:AlumnoID', {
        title: 'Editar Alumno',
        templateUrl: 'partials/edit-alumno.html',
        controller: 'editAlumnoCtrl',
        resolve: {
          customer: function(services, $route){
            var AlumnoID = $route.current.params.AlumnoID;
            return services.getAlumno(AlumnoID);
          },
          regiones: function (services) {
            return services.getRegiones();
          },
          roles: function (services) {
            return services.getRoles();
          },
          cargos: function (services) {
            return services.getCargos();
          }
        }
      })
      .when('/presentes', {
        title: 'Presentes',
        templateUrl: 'partials/presentes.html',
        controller: 'tomarListaCtrl'
      })
      .when('/perfil', {
        title: 'Perfil',
        templateUrl: 'partials/profile.html',
        controller: 'perfilCtrl'
      })
      .when('/cursos', {
        title: 'Cursos',
        templateUrl: 'partials/cursos.html',
        controller: 'cursosCtrl'
      })
      .when('/configuracion', {
        title: 'Configuración',
        templateUrl: 'partials/config.html',
        controller: 'configuracionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
}])

app.run(['$location', '$rootScope', '$cookieStore', 'LoginService', '$templateCache', '$http', 
      function (
  $location, $rootScope, $cookieStore, LoginService, $templateCache, $http) {

    
    var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
    // // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) { 
      console.log('autorizo');
      $rootScope.role = $rootScope.globals.currentUser.role;
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;

    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
      var loggedIn = $rootScope.globals.currentUser;

      if(loggedIn){
        $rootScope.logged = true;
      }

      if (restrictedPage && !loggedIn) {
        $location.path('/login');
      }

      // if (toState.name === 'login' && Auth.isLoggedIn()) {
      //       event.preventDefault(); 
      //       $state.go('dashboard');
      //   }
    });
    
    // $rootScope.logged = LoginService.isAuthenticated();
    
    // $rootScope.$on('$routeChangeStart', function(event)
    // {
    //   if (!LoginService.isAuthenticated()) {
    //     event.preventDefault();
    //     $location.path('/login');
    //   } else {

    //   }
    // })

    $rootScope.$on('$viewContentLoaded', function () {
      $templateCache.removeAll();
    });

}])

