app.controller('loginCtrl', function ($scope, $location, LoginService, $rootScope, $http) {

    $scope.formSubmit = function () {

        var myDataPromise = LoginService.login($scope.username, $scope.password);
        myDataPromise.then(function (result) {
            if (result) {
                console.log(result)
                $scope.error = '';
                $scope.username = '';
                $scope.password = '';
                $rootScope.role = LoginService.role();
                $scope.role = LoginService.role();
                LoginService.setCredentials($rootScope.username, $rootScope.password, $rootScope.role);

                $location.path('/inicio');

            } else {
                $scope.error = "Usuario o contraseña incorrecta.";
            }
        });
    };
});

app.controller('registrarseCtrl', function ($scope, regiones, $location,
    services, configuracion) {
    $scope.distritos = regiones;
    $scope.regiones = regiones;
    $scope.existeUsuario = false;

    $scope.generos = [{
        'cod': 'f',
        'genero': 'Femenino'
    }, {
        'cod': 'm',
        'genero': 'Masculino'
    }];

    // $scope.cambiarRegion = function () {
    //     var select = document.getElementById("region_tmp"),
    //         text = select.options[select.selectedIndex].innerText;
    //     $scope.region = text;
    // }

    $scope.cambiarRegion = function (regiones, distrito) {
        for (var i in regiones) {
            if (regiones[i].distrito==distrito){
                $scope.region = regiones[i].region;
                
                console.log(regiones[i].region);
                console.log(regiones[i].distrito);
                return;
            }
        }
    }

    $scope.checkUser = function (dni) {
        services.buscarDNI(dni).then(function (data) {
            console.log(data.data)
            if (data.data === '') {
                $scope.existeUsuario = false;
            } else {
                $scope.existeUsuario = true;
            }

        })
    }

    $scope.saveAlumno = function (customer) {
        $location.path('/alumnos');
        customer.cargo = 0;
        customer.rol = 0;

        //################################
        //Remover y arreglar asignaciones
        //################################
        //customer.region=0; 
        customer.comision = 1;
        //################################

        customer.region = $scope.region;
        // console.log(customer.region)

        services.insertAlumno(customer).then(function (status) {
            console.log("status.data.id -->");
            console.log(status.data.status);
            if (status.data.status == 'Success'){
                var texto = 'Ya estás registrad@, ahora debes esperar que el referente te active la cuenta.';
                swal({
                    title: "<small>Importante</small>",
                    text: texto,
                    html: true
                });
            } else {
                var texto = 'Hubo un problema con el registro. Revisa la conexión a internet';
                swal({
                    title: "<small>Importante</small>",
                    text: texto,
                    html: true
                });
            }
            console.log("customer");
            console.log(customer);
        })
        .catch (function (e) {
            console.log(e)
            var texto = 'Hubo un problema con el registro. Revisa la conexión a internet';
            swal({
                title: "<small>Importante</small>",
                text: texto,
                html: true
            });
        })
        ;

        
    };



})

app.controller('mainController', function ($scope, LoginService, services) {
    var f = new Date();
    var fecha_f = f.getFullYear() + '-' + (f.getMonth() + 1) + '-' + (f.getDate());
    $scope.fecha = format_fecha(fecha_f);
    $scope.id_mes = f.getMonth() + 1;

    services.getConfig('version').then(function (data) {
        $scope.version = data.data.valor;
    })


    $scope.logout = function () {
        LoginService.logout();
        LoginService.ClearCredentials();
        location.reload();
    }

    // $scope.reset = function () {
    //     var result=confirm("¿Quiere borrar los datos de prueba para probar la app?");
    //     if(result){
    //         services.resetData();
    //         location.reload();
    //     }
    // }
});

app.controller('inicioCtrl', function ($scope, $rootScope, $timeout, LoginService, services, $location, configuracion) {
    $rootScope.role = $rootScope.globals.currentUser.role;
    $rootScope.nombre = localStorage.getItem('nombre');
    $rootScope.apellido = localStorage.getItem('apellido');
    $rootScope.id = localStorage.getItem('id');
    $rootScope.comision = localStorage.getItem('comision');
    $rootScope.region = localStorage.getItem('region');
    $rootScope.distrito = localStorage.getItem('distrito');

console.log($rootScope.distrito)
 
        
     

    services.getConfig('instancia').then(function (data) {
        $scope.instancia = data.data.valor;
        $scope.instancia_ = data.data.valor = 'Distrital' ? 0 : 1 ;
    })


    
    services.getConfig('version').then(function (data) {
        $scope.version = data.data.valor;
    })

    if ($scope.role > 0) {
        //si el rol es coordinador
        services.getRegiones().then(function (data) {
            $scope.regiones = data;
        });
    }

    services.getVotacionActivada($rootScope.distrito).then(function (data) {
        console.log(data.data);
        console.log('id: ' + $rootScope.distrito);
        $scope.votohabilitado = data.data.voto_habilitado === '1' ? true : false;
        console.log($scope.votohabilitado);
    });

    $scope.init = function () {
        $timeout(function () {
            var vuelta = 1;

            console.log($scope.instancia)

            var instancia_ = 0;

            console.log($scope.id, $scope.comision, $scope.distrito, instancia_)
            
            console.log($scope.id, $scope.comision, $scope.distrito, instancia_)
            services.buscarVoto($scope.id, $scope.comision, $scope.distrito, instancia_).then(function (data) {
                
                $scope.tieneVoto1 = false;
                $scope.tieneVoto2 = false;
                $scope.tieneVoto3 = false;

                for (var i = 0; i < data.data.length; i++) {
                    console.log('----j----')
                    console.log(data.data[i].vuelta)
                    console.log(data.data[i].alumno)
                    console.log(typeof(data.data[i].vuelta))

                    switch (data.data[i].vuelta) {
                        case '1':
                            $scope.votastepor1 = data.data[i].alumno;
                            $scope.tieneVoto1 = true;
                            break;
                        case '2':
                            $scope.votastepor2 = data.data[i].alumno;
                            $scope.tieneVoto2 = true;
                            break;
                        
                        case '3':
                            $scope.votastepor3 = data.data[i].alumno;
                            $scope.tieneVoto3 = true;
                            break;
                        
                        default:
                            break;
                    }
                    
                }

                services.getVotacionActivada($rootScope.distrito).then(function (data) {
                    console.log(data.data);
                    console.log('id: ' + $rootScope.distrito);
                    $scope.votohabilitado = data.data.voto_habilitado === '1' ? true : false;
                    console.log($scope.votohabilitado);
                });

                // $scope.votastepor = data.data.alumno;
                
                // console.log('=======================')
                // if (data.data.alumno===undefined){
                //     $scope.tieneVoto1 = false;
                // } else {
                //     $scope.tieneVoto1 = true;
                // }

            });


            // services.tieneVoto($scope.id, $scope.comision, $scope.distrito, vuelta /* 'var vuelta' cambiar a valor de variable */ , instancia_)
            //     .then(function (data) {
            //         console.log('mono' + data.data)
            //         if (data.data.voto == undefined) {
            //             console.log("podés votar")
            //             $scope.tieneVoto = false;
            //         } else {
            //             $scope.tieneVoto = true;
            //             console.log("ya votaste")
            //         }
            //     });

            services.buscar_vuelta($rootScope.comision, $rootScope.distrito, instancia_).then(function (data) {
                
                $scope.b1ravuelta = false;
                $scope.b2davuelta = false;
                $scope.b3ravuelta = false;

                for (var index = 0; index < data.data.length; index++) {
                    switch (data.data[index].vuelta) {
                        case '1':
                            $scope.b1ravuelta = true;
                            //asigna la vuelta actual para enviar el dato a la votación
                            $scope.vuelta_actual = 1;
                            break;
                            
                        case '2':
                            $scope.b2davuelta = true;
                            $scope.vuelta_actual = 2;
                            break;

                        case '3':
                            $scope.b3ravuelta = true;
                            $scope.vuelta_actual = 3;
                            break;

                        default:
                            break;
                    }
                }
            });

            services.buscarPostulado($scope.id, $rootScope.comision, $rootScope.distrito, instancia_).then(function (data) {
                // $scope.es_postulante = (data.data.id_alumno !== undefined) ? true : false;
                $scope.es_postulante1 = false;
                $scope.es_postulante2 = false;
                $scope.es_postulante3 = false;
                
                for (var index = 0; index < data.data.length; index++) {
                    console.log(data.data[index].vuelta)
                    switch (data.data[index].vuelta) {
                        case '1':
                            $scope.es_postulante1 = true;
                            break;

                        case '2':
                            $scope.es_postulante2 = true;
                            break;

                        case '3':
                            $scope.es_postulante3 = true;
                            break;

                        default:
                            break;
                    }
                }

            })

        }, 1);
    };

    //*************************
    //FALTA PARÁMETRO 'COMISION'
    //*************************
    // services.buscarPostulado($scope.id, $scope.distrito /*falta comision */).then(function (data) {
    //     $scope.es_postulante = (data.data.id_alumno !== undefined) ? true : false;
    // })

    

    $scope.cargarComisiones = function (distrito) {
        services.getComisionesDelDistrito(distrito).then(function (data) {
            $scope.comisiones = data.data;    
            console.log(data.data)
        })
    }

    $scope.filterByRegion = function (nRegion) {
        return function (item) {
            if (item.region == nRegion) {
                return true;
            }
            return false;
        };
    };

    services.getNotification().then(function (data) {
        //$scope.textoNotificacion = "<pre>" + data.data[0].notification_msg +"</pre>";
        $scope.textoNotificacion = data.data[0].notification_msg;
        console.log($scope.textoNotificacion);
    });





 




    if (LoginService.getNotificacion() == 0) {
        $("#notification-number").html("0");
        $scope.textoNotificacion = "Estás al día";
    } else {
        $("#notification-number").html("1");
        $("#notification-number").removeClass("badge-notify-grey");
        $("#notification-number").addClass("badge-notify-red");
    }

    $scope.votar = function (id, comision, distrito, vuelta, instancia_) {
        console.log(id, comision, distrito, vuelta, instancia_)
        //services.tieneVoto(id).then(function (data) {
        services.tieneVoto(id, comision, distrito, vuelta, instancia_).then(function (data) {
            console.log(id)
            if (data.data.voto == undefined) {
                console.log("podés votar")
                $scope.tieneVoto = false;
                $location.path('/votar/' + id + '/vuelta/' + vuelta);
            } else {
                $scope.tieneVoto = true;
                console.log("ya votaste")
            }
        });
    }

    // $scope.votar2 = function (id, comision, distrito, vuelta, instancia_) {
    //     services.tieneVoto(id, comision, distrito, 2 /* valor fijo provisorio */, instancia_).then(function (data) {
    //         console.log(id)
    //         if (data.data.voto == undefined) {
    //             console.log("podés votar")
    //             $scope.tieneVoto = false;
    //             $location.path('/votar2/' + id);
    //         } else {
    //             $scope.tieneVoto = true;
    //             console.log("ya votaste")
    //         }
    //     });
    // }



    $scope.postular = function (id) {
        swal({
                title: "¿Estás segur@?",
                text: "¿Querés postularte?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Sí, quiero postularme",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                // if (isConfirm) {
                //     services.postular_alumno(id).then(function (data) {
                //         $scope.es_postulante = true;
                //     });
                // }

                if (isConfirm) {
                    comision = localStorage.getItem('comision');
                    region = localStorage.getItem('region');
                    distrito = localStorage.getItem('distrito');
                    vuelta = 1;
                    var instancia_ = $scope.instancia == 'Distrital' ? 0 : 1 ;
                    console.log(id, comision, region, distrito, vuelta, instancia_)
                    services.postular_alumno(id, comision, region, distrito, vuelta, instancia_)
                        .then(function (data) {
                            $scope.es_postulante = true;
                    });
                }

        });
    };

    angular.element(document).ready(function () {
        $("#version").on("click", function () {
            var texto = "Versión " + $scope.version + "<br><br>";
            texto += "Creado por ";
            texto += "Promoción de Derechos y Valores Ciudadanos";

            swal({
                title: "<small>Acerca de </small>",
                text: texto,
                html: true
            });
        })

        $("#notificaciones").on("click", function () {
            swal({
                    title: "<h4>Notificaciones</h4>",
                    text: $scope.textoNotificacion,
                    html: true
                },
                function () {
                    if (LoginService.getNotificacion() == 1) {
                        LoginService.setNotificacion(0);
                        $("#notification-number").html("0");
                        $("#notification-number").removeClass("badge-notify-red");
                        $("#notification-number").addClass("badge-notify-grey");
                        services.updateNotification(LoginService.id());
                    }
                }
            );

        })

        $scope.setVuelta = function (nvuelta) {
            $scope.vuelta_actual = nvuelta;
        }

        $scope.init();
    })
});




app.controller('cronogramaCtrl', function (services, $scope, $rootScope, LoginService) {

    services.getCronograma($rootScope.distrito).then(function (data) {
        console.log(data.data.cronograma)
        $scope.message = data.data.cronograma;
    })

    //si es admin puede escribir
    if (LoginService.role() == 2) {
        $("#comment").prop('readonly', '');
    }

    $scope.guardar = function () {
        var distrito = $rootScope.distrito;
        console.log(distrito)
        var texto = $("#comment").val();
        var data = {
            distrito: distrito,
            valor: texto
        };

        services.setCronograma(data).then(function (data) {
            console.log(data.data);
        })
    }

})

app.controller('guiaTrabajoCtrl', function (services, $scope, LoginService) {

})


app.controller('votarCtrl', function ($rootScope, $routeParams, $scope, services, $location) {
    // var ncomision = LoginService.comision();
    
    services.getConfig('instancia').then(function (data) {
        var instancia_ = data.data.valor == 'Distrital' ? 0 : 1;
        
        $scope.instancia_ = instancia_;
        
        var vuelta = $routeParams.vuelta;
        console.log('vuelta params: ' + vuelta);
        console.log($rootScope.comision, $rootScope.distrito, vuelta, instancia_);
        
        services.getPostulantes($rootScope.comision, $rootScope.distrito, vuelta, instancia_)
            .then(function (data) {
                $scope.postulantes = data.data;
        })
    })

    $scope.registrarVoto = function (idAlumno, idPostulante, alumno) {
        $scope.ocultar_boton=true;

        swal({
                title: "¿Estás segur@?",
                text: "Votarás por " + alumno,
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Sí, quiero votarl@",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    services.insertarVoto(idAlumno, idPostulante, $rootScope.comision, 
                        $rootScope.distrito, $routeParams.vuelta, 0).then(function (data) {
                        console.log(data.data);
                        $location.path('/inicio');
                    });
                }
            });
    }
});


app.controller('listarAlumnosCtrl', function ($scope, filterFilter, services, $timeout, $route, configuracion) {
    var region = localStorage.getItem('region');
    var distrito = localStorage.getItem('distrito');
    var rol = localStorage.getItem('rol');
    var cargo = localStorage.getItem('cargo');

    console.log(region, distrito, rol)

    
    var totalcomisiones = configuracion.opciones.totalcomisiones;
    
    // $scope.currentPage = 1; // keeps track of the current page
    // $scope.pageSize = 10; // holds the number of items per page


    //###############################
    // pagination controls

    $scope.search = {};

	$scope.resetFilters = function () {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
    };
    
    //###############################

    var comisiones_ = [];
    for (var i = 1; i <= totalcomisiones; i++) {
        comisiones_.push(i.toString());
    }

    $scope.comisiones = comisiones_;

    $scope.clearFilter = function () {
        document.getElementById("buscar").value = '';
        $scope.alumno = '';
    }
    
    
    services.getAlumnos(region, distrito, rol, cargo).then(function (data) {
        $scope.alumnos = data.data;
        
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.alumnos.length;
        $scope.entryLimit = 20; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);



        $scope.myId = localStorage.getItem('id');
        $scope.init();
    })


    $scope.init = function () {
        $timeout(function () {
            var po = localStorage.getItem("idAlumno");
            if (po === null || po === "" || po === "undefined" || po === undefined || po == 0) {
                var p = 1;
            } else {
                po = (po === null || po === "" || po === "undefined" || po === undefined || po == 0) ? "#top" : "#id" + po;
                $(document).scrollTop($(po).offset().top);
            }
        }, 1)
    }

    $scope.guardarAceptado = function (id, estado) {
        var result = 0;

        if (estado === true) {
            result = 1;
        } else {
            result = 0;
        }
        console.log(id, estado, result)

        services.updateAceptado(id, result).then(function (status) {
            console.log(status)
        })
    }

    $scope.guardarComision = function (id, result) {
        services.updateComision(id, result).then(function (status) {
            console.log(status)
        })
    }

    $scope.actualizar = function () {
        $route.reload();
    }

    var f = new Date();
    $scope.mesActual = f.getMonth() + 1;


    $scope.$watch('alumno', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.alumnos, newVal);
		$scope.totalItems = $scope.filtered === undefined ? 0 : $scope.filtered.length;
		$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
		$scope.currentPage = 1;
	}, true);

    $scope.SetSort = function (objName , isCurrency) {
        $scope.predicate = objName;
        $scope.reverse = !$scope.reverse;
    }

    // $scope.SetSort = function (objName , isCurrency) {
    //     console.log(objName , isCurrency);  
    //     $scope.predicate = objName;
    //     $scope.reverse = !$scope.reverse;
    //     if(angular.isDefined(isCurrency)) {
    //         console.log(objName , isCurrency); 
    //         angular.forEach($scope.alumnos, function (obj) {
    //         for(var i in obj )
    //         {
    //            if(i == objName && obj[i] != '') 
    //               obj[i] =  parseFloat(obj[i]);  
    //               console.log(obj[i]);     
    //         }
    //        });
    //     }
    // }

});


app.controller('editAlumnoCtrl', function ($scope, $route, $rootScope, $location, $routeParams,
    services, customer, regiones, cargos, roles, configuracion) {

    var AlumnoID = ($routeParams.AlumnoID) ? parseInt($routeParams.AlumnoID) : 0;
    $rootScope.title = (AlumnoID > 0) ? 'Editar Alumno' : 'Agregar Alumno';
    $scope.buttonText = (AlumnoID > 0) ? 'Actualizar Alumno' : 'Agregar nuevo Alumno';

    var original = customer.data;

    $scope.distritos = regiones;
    $scope.regiones = regiones;
    $scope.roles = roles;
    $scope.cargos = cargos;
    $scope.generos = [{
        'cod': 'f',
        'genero': 'Femenino'
    }, {
        'cod': 'm',
        'genero': 'Masculino'
    }];

    //$scope.configuracion = configuracion;
    var totalcomisiones = configuracion.opciones.totalcomisiones;

    original._id = AlumnoID;
    $scope.customer = angular.copy(original);
    $scope.customer._id = AlumnoID;

    var comisiones_ = [];
    for (var i = 0; i <= totalcomisiones; i++) {
        comisiones_.push(i.toString());
    }

    $scope.comisiones = comisiones_;
    $scope.region = customer.data.region;
    console.log(customer.data)

    $(document).scrollTop($("#top").offset().top);

    localStorage.setItem("idAlumno", AlumnoID);

    // $scope.cambiarRegion = function () {
    //     var select = document.getElementById("region_tmp"),
    //         text = select.options[select.selectedIndex].innerText;
    //     $scope.region = text;
    // }

    $scope.cambiarRegion = function (regiones, distrito) {
        for (var i in regiones) {
            if (regiones[i].distrito == distrito) {
                $scope.region = regiones[i].region;

                console.log(regiones[i].region);
                console.log(regiones[i].distrito);
                return;
            }
        }
    }

    $scope.isClean = function () {
        return angular.equals(original, $scope.customer);
    }

    $scope.darDeBajaAlumno = function (customer) {
        var nombre = $("#apellido").val();
        console.log(nombre)
        $location.path('/alumnos');
        if (confirm("Está seguro que quiere dar de baja al alumno número: " + nombre + " " + $scope.customer._id) == true)
            services.darDeBajaAlumno(customer.id);

        $route.reload();
    }

    $scope.deleteAlumno = function (customer) {

    };

    $scope.saveAlumno = function (customer) {
        $location.path('/alumnos');
        customer.region = $scope.region;

        //si es docente o coordinador asigna comisión 0
        if (customer.rol > 0) {
            customer.comision = 0;
        }
        //si es alumno al que le asignaron comisión 0 entonces la cambia a comisión 1
        else if (customer.rol == 0 && customer.comision == 0) {
            customer.comision = 1;
        }

        if (AlumnoID <= 0) {
            services.insertAlumno(customer).then(function (status) {
                console.log("status.data.id -->")
                console.log(status)
                console.log("customer")
                console.log(customer)
            });

            services.getAlumnos();
        } else {

            services.updateAlumno(AlumnoID, customer).then(function (status) {
                console.log(customer)
                console.log(status)
                console.log('-------------')
            })
            .catch(function (e) {
                console.log(e)
                var texto = 'Hubo un problema con el registro. Revisa la conexión a internet';
                swal({
                    title: "<small>Importante</small>",
                    text: texto,
                    html: true
                });
            })
        }
        $route.reload();
    };

});

app.controller('verComisionesCtrl', function ($scope, services) {
        $scope.obj = {};
        $scope.role = localStorage.getItem('role');
        $scope.comision = localStorage.getItem('comision');
        $scope.distrito = localStorage.getItem('distrito');
        $scope.region = localStorage.getItem('region');
        $scope.cargo = localStorage.getItem('cargo');

    console.log($scope.distrito)
    //agregar que controle el 100% de la comisión votado

    
    $scope.id_alumno = undefined;
    $scope.comision_activa = undefined;

    services.getAlumnos($scope.region, $scope.distrito, $scope.role, $scope.cargo).then(function (data) {
        $scope.alumnos = data.data;
    })

    services.getListarDistritos($scope.region, $scope.distrito, $scope.cargo).then(function (data) {
        console.log($scope.region)
        $scope.distritos = data.data;
    })

    angular.element(document).ready(function () {


        $('#comisiones').on('change', function () {
            var ncomision = $("#comisiones option:selected").text();
            var instancia_ = $scope.instancia == 'Distrital' ? 0 : 1;
            $scope.comision_activa = ncomision;
            console.log(ncomision, $scope.obj.distrito, 1 /* poner variable */ , instancia_)
            $scope.cambiarComision(ncomision, $scope.obj.distrito, 1 /* poner variable */ , instancia_);
        })
    })

    $scope.cambiarDistrito = function (distrito) {
        //ok
        services.getListarComisiones(distrito).then(function (data) {
            $scope.numComisiones = data.data;
        })

    }

    
    $scope.cambiarComision = function (ncomision, distrito) {
        
        services.getComisiones(ncomision, distrito).then(function (data) {
            $scope.comisiones = data.data;
        })

    }

    $scope.agregarAlumnoEnComision = function (x) {
        // var alumno = $("#typeahead").val();
        $("#typeahead").val('');
        console.log($scope.id_alumno );
    }

    $scope.formatLabel = function (model) {
        $scope.id_alumno = model.id;
        // console.log(model.alumno)
        // console.log(model.id)
        return model.alumno;
    };


});

app.controller('notificacionesCtrl', function ($scope, services) {
    services.getComisiones(0).then(function (data) {
        $scope.comisiones = data.data;
    })
});

app.controller('estadisticasCtrl', function ($scope, $routeParams, services) {
    // $scope.role = LoginService.role();
    // $scope.comision = LoginService.comision();
    $scope.obj={};
    $scope.role = localStorage.getItem('role');
    $scope.comision = localStorage.getItem('comision');
    $scope.distrito = localStorage.getItem('distrito');
    $scope.region = localStorage.getItem('region');
    $scope.cargo = localStorage.getItem('cargo');

    $scope.vuelta_actual = $routeParams.vuelta;
    
    $scope.mostrarSelector = false;
    
    $scope.mostrarAgregarVuelta = false;

    

    services.getConfig('instancia').then(function (data) {
        $scope.instancia = data.data.valor;
         $scope.instancia_ = $scope.instancia == 'Distrital' ? 0 : 1;
    })
    
    services.getListarDistritos($scope.region, $scope.distrito, $scope.cargo).then(function (data) {
        console.log($scope.region)
        $scope.distritos = data.data;
    })

    angular.element(document).ready(function () {
        if ($scope.role == 0) {
            // $scope.distrito=1; //la plata
            services.getConfig('instancia').then(function (data) {
                $scope.instancia = data.data.valor;
                
                var instancia_ = $scope.instancia == 'Distrital' ? 0 : 1;
                console.log($scope.instancia)
                $scope.cambiarComision($scope.comision, $scope.distrito, $routeParams.vuelta, instancia_);

            })

        } 
        else if ($scope.role == 2) {
            //si es coordinador no carga el contenido hasta que seleccione el select
        }

        $('#comisiones').on('change', function () {
            var ncomision = $("#comisiones option:selected").text();
            var instancia_ = $scope.instancia == 'Distrital' ? 0 : 1;
            // if (ncomision !== undefined && $scope.obj.distrito !== undefined && $scope.vuelta !== undefined && instancia_ !== undefined ){
            $scope.cambiarComision(ncomision, $scope.obj.distrito, $scope.vuelta, instancia_);
            
        })

        $('#vuelta').on('change', function () {
            var ncomision = $("#comisiones option:selected").text();
            var vuelta = $("#comisiones option:selected").text();
            console.log('vuelta select: '+ $scope.vuelta)
            var instancia_ = $scope.instancia == 'Distrital' ? 0 : 1;
            $scope.cambiarComision(ncomision, $scope.obj.distrito, $scope.vuelta, instancia_);
        })
    })

    $scope.cambiarDistrito = function (distrito) {
        //ok
        services.getListarComisiones(distrito).then(function (data) {
            $scope.numComisiones = data.data;
        })

    }

    $scope.actualizar = function (vuelta) {
        console.log('actualizar vuelta  : '+vuelta)
        var ncomision, distrito;
        if ($scope.role == 2){
            ncomision = $("#comisiones option:selected").text();
            distrito = $scope.obj.distrito;
            vuelta_ = $scope.vuelta;
        } else {
            ncomision = $scope.comision;
            distrito = $scope.distrito;
            vuelta_ = vuelta;
        }
        var instancia_ = $scope.instancia == 'Distrital' ? 0 : 1;
        console.log(ncomision, distrito, vuelta_, instancia_)
        $scope.cambiarComision(ncomision, distrito, vuelta_, instancia_);
    }

    $scope.cambiarComision = function (ncomision, distrito, vuelta, instancia) {
        console.log('ncomision, distrito: ' + ncomision, distrito, vuelta, instancia)
        // if (distrito==undefined) return;
        
        

        services.getTotal(ncomision, distrito, vuelta, instancia).then(function (data) {
            $scope.result = data.data;
        })

        services.getEstadisticas(ncomision, distrito, vuelta, instancia).then(function (data) {
            $scope.estadisticas = data.data;

            console.log(data.data)
            
            // if ($scope.estadisticas !== '') {   
            //     var v = $scope.estadisticas.map(x => x.votos);
            //     var x = compressArray(v);
            //     var cuenta=0;

            //     for (b in x) {
            //         if (x[b].value != 0){
            //             cuenta++;
            //         }
            //     }

            //     if (cuenta > 0) {
            //         $scope.hayEmpate = true;
            //     } else {
            //         $scope.hayEmpate = false;
            //     }
            // }

            if ($scope.estadisticas !== '') {   
                marcarEmpates($scope.estadisticas)
            }


            console.log('distrito: ' + distrito + ' comision: ' + ncomision)
            // console.log(data)
            // $scope.totalPostulantes = data.data.length;
        })

        services.getCuentaPostulantes(ncomision, distrito, vuelta, instancia).then(function (data) {
            console.log(ncomision, distrito, vuelta, instancia)
            console.log(data.data)
            $scope.totalPostulantes = data.data.cuenta;
        })

        services.contarVotos(ncomision, distrito, vuelta, instancia).then(function (data) {
            console.log(ncomision, distrito, vuelta, instancia)
            console.log(data.data)
            $scope.cuentaVotos = data.data.cuenta;
        })

        services.buscar_vuelta(ncomision, distrito, instancia).then(function (data) {
            console.log(ncomision, distrito, instancia)
            $scope.vueltas = data.data;

            //activa o desactiva el botón de agregar vuelta
            $scope.mostrarAgregarVuelta = $scope.vueltas.length == $scope.vuelta ? true : false;
        })

        
    }

    // $scope.activarVuelta = function () {
    //     $scope.mostrarSelector = true;
    // }

    $scope.desempatar = function (grupo) {
        swal({
                title: "¿Estás segur@?",
                text: "¿Crear otra VUELTA para Desempatar el grupo " + grupo + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Sí, crear otra vuelta y postular a empatados del grupo" + grupo,
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    var v = parseInt($routeParams.vuelta) + 1;
                    console.log($scope.numComisiones.comision, $scope.distrito, $scope.instancia_, v)
                    // $scope.habilitarVotacion(comision, distrito, instancia, vuelta + 1);
                    var result = $scope.estadisticas.filter(estadistica => estadistica.grupoempate == grupo)
                    for(x in result){
                        console.log(result[x].id_alumno)

                    }
                    
                }

            });
    }



    $scope.habilitarVotacion = function (comision, distrito, instancia, vuelta) {
        console.log(vuelta)
        
        if(vuelta === undefined || vuelta == null){
            vuelta = 1;
        }

        services.habilitarVotacion(comision, distrito, instancia, vuelta).then(function (data) {
            console.log('habilitar votación --> '+ comision, distrito, instancia, vuelta)

            services.buscar_vuelta(comision, distrito, instancia).then(function (data) {
                console.log('buscar vuelta; ' + comision, distrito, instancia);
                $scope.vueltas = data.data;
                //activa o desactiva el botón de agregar vuelta
                $scope.mostrarAgregarVuelta = $scope.vueltas.length == $scope.vuelta ? true : false;
            })
        })
        .catch(function (e) {
            console.log(e)
            var texto = 'Hubo un problema. ' + e;
            swal({
                title: "<small>Error</small>",
                text: texto,
                html: true
            });
        })
    }
});


app.controller('perfilCtrl', function ($scope, services, LoginService) {
    var AlumnoID = LoginService.id();
    console.log(LoginService.id())
    services.getAlumno(AlumnoID).then(function (data) {
        $scope.perfil = data.data;
    })
})

app.controller('configuracionCtrl', function ($scope, services, configuracion) {
    //borra la posición de alumno
    // localStorage.setItem("idAlumno", undefined);

     $scope.role = localStorage.getItem('role');
     $scope.comision = localStorage.getItem('comision');
     $scope.distrito = localStorage.getItem('distrito');
     $scope.region = localStorage.getItem('region');
     $scope.cargo = localStorage.getItem('cargo');

    
    services.getListarDistritos($scope.region, $scope.distrito, $scope.cargo).then(function (data) {
        console.log($scope.region)
        $scope.distritos = data.data;
    })

    services.getVotacionActivada($scope.distrito).then(function (data) {
        console.log('voto: ' + data.data)
        $scope.votohabilitado = data.data;
    });

    services.getPostuActivada($scope.distrito).then(function (data) {
        console.log('voto: ' + data.data)
        $scope.postuhabilitada = data.data;
    });

    $scope.votoOnOff = function (distrito) {
        var x = $("#distrito-" + distrito).is(':checked');
        
        console.log('x: ' + x)
        var estado = x===true ? 1 : false;
        console.log('estado: ' + estado)
        services.updateHabilitarVotacion(distrito, estado).then(function (data) {
            console.log(data)
        })
    }

    $scope.postuOnOff = function (distrito) {
        var x = $("#distrito-postu-" + distrito).is(':checked');

        console.log('x: ' + x)
        var estado = x === true ? 1 : false;
        console.log('estado: ' + estado)
        services.updateHabilitarPostulacion(distrito, estado).then(function (data) {
            console.log(data)
        })
    }
    $scope.resultadoDistrital = function () {
        
    }
})




