app.factory('configuracion', function (OPTIONS) {
    return {
        opciones: OPTIONS
    }
});


app.factory("services", ['$http', function ($http) {
    var serviceBase = 'services/';
    var obj = {};
    obj.getAlumnos = function (region, distrito, rol) {
        return $http.get(serviceBase + 'alumnos?region=' + region 
                        + '&distrito=' + distrito + '&rol=' + rol);
        //return $http.get(serviceBase + 'alumnos');
    };

    obj.getAlumno = function (AlumnoID) {
        return $http.get(serviceBase + 'alumno?id=' + AlumnoID);
        //.then(function(r){
        // console.log(r.data)
        // });
    };



    obj.insertAlumno = function (customer) {
        return $http.post(serviceBase + 'insertAlumno', customer).then(function (results) {
            return results;
        });
    };

    obj.insertarVoto = function (idalumno, idvoto, comision, distrito, vuelta, instancia) {
        console.log('insertar_voto ? idalumno = ' + idalumno + 
        '&idvoto=' + idvoto +
        '&comision=' + comision +
        '&distrito=' + distrito +
        '&vuelta=' + vuelta +
        '&instancia=' + instancia)

        return $http.get(serviceBase + 'insertar_voto?idalumno=' + idalumno + 
                '&idvoto=' + idvoto +
                '&comision=' + comision +
                '&distrito=' + distrito +
                '&vuelta=' + vuelta +
                '&instancia=' + instancia);
    };

    obj.buscarVoto = function (idalumno, comision, distrito, vuelta, instancia) {
        console.log('buscar_voto?idalumno=' + idalumno +
        '&comision=' + comision +
        '&distrito=' + distrito +
        '&vuelta=' + vuelta +
        '&instancia=' + instancia)
        return $http.get(serviceBase + 'buscar_voto?idalumno=' + idalumno +
                            '&comision=' + comision +
                            '&distrito=' + distrito +
                            '&vuelta=' + vuelta +
                            '&instancia=' + instancia);
    };

    obj.buscarPostulado = function (idalumno, distrito) {
        return $http.get(serviceBase + 'buscar_postulado?idalumno=' + idalumno + '&distrito=' + distrito);
    };

    obj.buscarDNI = function (dni) {
        return $http.get(serviceBase + 'buscar_dni?dni=' + dni);
    };

    obj.updateAlumno = function (id, customer) {
        console.log(customer)
        return $http.post(serviceBase + 'updateAlumno', {
            id: id,
            customer: customer
        }).then(function (status) {
            return status.data;
        });
    };

    obj.deleteAlumno = function (id) {
        return $http.get(serviceBase + 'darDeBajaAlumno?id=' + id).then(function (status) {
            return status.data;
        });
    };

    obj.darDeBajaAlumno = function (id) {
        return $http.delete(serviceBase + 'deleteAlumno?id=' + id);
    };

    obj.getRegiones = function () {
        return $http.get(serviceBase + 'regiones').then(function (status) {
            return status.data;
        });
    };

    obj.getCargos = function () {
        return $http.get(serviceBase + 'cargos').then(function (status) {
            return status.data;
        });
    };

    obj.getRoles = function () {
        return $http.get(serviceBase + 'roles').then(function (status) {
            return status.data;
        });
    };

    obj.getComisiones = function (ncomision, distrito, vuelta, instancia) {
        return $http.get(serviceBase + 'ver_comision?ncomision=' + ncomision +
                                    '&distrito=' + distrito);
    }

    obj.getComisionesDelDistrito = function (ndistrito) {
        console.log('ndistrito: ' + ndistrito)
        return $http.get(serviceBase + 'ver_comision_del_distrito?distrito=' + ndistrito);
    }


    obj.updateAceptado = function (id, estado) {
        console.log(estado)
        return $http.get(serviceBase + 'updateAceptado?id=' + id + '&estado=' + estado);
    }

    obj.updateComision = function (id, comision) {
        return $http.get(serviceBase + 'updateComision?id=' + id + '&comision=' + comision);
    }

    obj.getTotal = function (ncomision, distrito) {
        return $http.get(serviceBase + 'totales?ncomision=' + ncomision + '&distrito=' + distrito);
    }

    obj.getEstadisticas = function (ncomision, distrito, vuelta, instancia) {
        return $http.get(serviceBase + 'estadisticas?ncomision=' + ncomision + 
                    '&distrito=' + distrito +
                    '&vuelta=' + vuelta +
                    '&instancia=' + instancia);
    }

    obj.getCuentaPostulantes = function (ncomision, distrito, vuelta, instancia) {
        return $http.get(serviceBase + 'contar_postulantes?ncomision=' + ncomision +
            '&distrito=' + distrito +
            '&vuelta=' + vuelta +
            '&instancia=' + instancia);
    }


    // obj.postular_alumno = function (idalumno) {
    //     return $http.get(serviceBase + 'postular_alumno?idalumno=' + idalumno);
    // }

    obj.postular_alumno = function (idalumno, comision, region, distrito, vuelta, instancia) {
        return $http.get(serviceBase + 'postular_alumno?idalumno=' + idalumno + '&comision=' + comision + '&region=' + region + '&distrito=' + distrito + '&vuelta=' + vuelta + '&instancia=' + instancia);
    }

    obj.getConfig = function (clave) {
        return $http.get(serviceBase + 'get_config?clave=' + clave);
    }

    obj.setConfig = function (data) {
        return $http.post(serviceBase + 'set_config', data).then(function (results) {
            return results;
        });
    }

    // obj.getPostulantesTotal = function (ncomision) {
    //     return $http.get(serviceBase + 'total_postulantes?ncomision=' + ncomision);
    // }
    
    obj.getPostulantes = function (comision, distrito, vuelta, instancia) {
        return $http.get(serviceBase + 'ver_postulantes?comision=' + comision +
                            '&distrito=' + distrito +
                            '&vuelta=' + vuelta +
                            '&instancia=' + instancia);
    }

    obj.contarVotos = function (comision, distrito, vuelta, instancia) {
        return $http.get(serviceBase + 'contar_votos?ncomision=' + comision +
            '&distrito=' + distrito +
            '&vuelta=' + vuelta +
            '&instancia=' + instancia);
    }

    obj.getListarComisiones = function (distrito) {
        return $http.get(serviceBase + 'listar_comisiones' + 
                            '?distrito=' + distrito);
    }

    obj.getListarDistritos = function (region) {
        console.log(region)
        return $http.get(serviceBase + 'listar_distritos?region=' + region);
    }

    obj.setVoto = function (id) {
        return $http.get(serviceBase + 'set_voto?id=' + id);
    }

    obj.buscar_vuelta = function (comision, distrito, instancia) {
        return $http.get(serviceBase + 'buscar_vuelta?comision=' + comision +
                            '&distrito=' + distrito +
                            '&instancia=' + instancia
                            );
    }

    obj.tieneVoto = function (idalumno, comision, distrito, vuelta, instancia) {
                
        console.log('tiene_voto?idalumno=' + idalumno +
            '&comision=' + comision +
            '&distrito=' + distrito +
            '&vuelta=' + vuelta +
            '&instancia=' + instancia)

        return $http.get(serviceBase + 'tiene_voto?idalumno=' + idalumno +
                            '&comision=' + comision +
                            '&distrito=' + distrito +
                            '&vuelta=' + vuelta +
                            '&instancia=' + instancia );
    }
 
    obj.getLogin = function (user, pass) {
        return $http.post(serviceBase + 'login', {
            user: user,
            pass: pass
        }).then(function (results) {
            return results;
        });
    };

    obj.getVersion = function () {
        return $http.get(serviceBase + 'version');
    };

    obj.getCurrentId = function (id) {
        return id;
    };

    obj.getNotification = function () {
        return $http.get(serviceBase + 'notificaciones');
    };

    obj.updateNotification = function (id) {
        console.log("id " + id)
        return $http.get(serviceBase + 'update_notification?id=' + id);
    };

    obj.getDatosSistema = function () {
        return $http.get(serviceBase + 'sistema');
    };

    obj.resetData = function () {
        return $http.get(serviceBase + 'reset');
    };

    return obj;
}]);


/*
app.factory('alumnoId', function ($rootScope) {
    var idToScroll='';
    return {
        getIdAlumno: function(){
            return idToScroll;
        },
        setIdAlumno: function(val){
            idToScroll = val;
            $rootScope.idToScroll = idToScroll;
            return idToScroll;
        }
    }
})
*/

app.factory('LoginService', function ($rootScope, $http, Base64, $cookieStore) {
    var isAuthenticated = false,
        role = '', id = '', nombre = '', apellido = '',
        mostrarNotificacion = '', comision = '', region = '', distrito = '';
    return {
        login: function (username, password) {
            var serviceBase = 'services/';
            return $http.post(serviceBase + 'login', {
                user: username,
                pass: password
            }).then(function (results) {
                isAuthenticated = username === results.data.dni && password === results.data.pass;
                role = results.data.rol;
                id = results.data.id;
                nombre = results.data.nombre;
                apellido = results.data.apellido;
                mostrarNotificacion = results.data.notification_show;
                comision = results.data.comision;
                region = results.data.region;
                distrito = results.data.distrito;

                localStorage.setItem('role', role);
                localStorage.setItem('id', id);
                localStorage.setItem('nombre', nombre);
                localStorage.setItem('apellido', apellido);
                localStorage.setItem('comision', comision);
                localStorage.setItem('region', region);
                localStorage.setItem('distrito', distrito);

                return role;
            });
        },
        setCredentials: function (username, password, role) {
            var authdata = Base64.encode(username + ':' + password + ':' + role);
            console.log(authdata)
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata,
                    role: role
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        },
        ClearCredentials : function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';

            localStorage.clear();
        },
        isAuthenticated: function () {
            $rootScope.logged = isAuthenticated;
            return isAuthenticated;
        },
        role: function () {
            $rootScope.role = role;
            return role;
        },
        id: function () {
            $rootScope.id = id;
            return id;
        },
        nombre: function () {
            $rootScope.nombre = nombre;
            return nombre;
        },
        apellido: function () {
            $rootScope.apellido = apellido;
            return apellido;
        },
        comision: function () {
            $rootScope.comision = comision;
            return comision;
        },
        getNotificacion: function () {
            $rootScope.mostrarNotificacion = mostrarNotificacion;
            return mostrarNotificacion;
        },
        setNotificacion: function (val) {
            mostrarNotificacion = val;
            $rootScope.mostrarNotificacion = mostrarNotificacion;
        },
        logout: function () { 
            isAuthenticated=false;
        }
    };
});


app.factory('Base64', function () {

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    }
});