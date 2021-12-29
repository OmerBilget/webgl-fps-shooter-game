//parse obj file string to vertices and faces 
function parseOBJ(text, object,scale) {
    const linelist = text.split('\n');
    var index = 0;
    for (var i = 0; i < linelist.length; i++) {
        const tmp = linelist[i].split(' ');
        if (tmp[0] === '#') {
            continue;
        }
        const type = tmp.shift();
        if (type === 'v') {
            for (var j = 0; j < tmp.length; j++) {
                tmp[j] = Number(tmp[j])*scale;
            }
            object.vertices.push(tmp);
        }else if (type === 'usemtl') {
            object.materialindex.push(index);
            object.materialid.push(tmp[0]);
        } else if (type === 'f') {
            index += 1;
            var list = [];
            for (var j = 0; j < tmp.length; j++) {
                const e = tmp[j].split('/');
                for (var k = 0; k < e.length; k++) {
                    e[k] = Number(e[k] - 1);
                }
                list.push(e);
            }
            object.faces.push(list);

        }
    }

}
//if object uses materials parse mtl
function parseMTL(text, object) {
    const linelist = text.split('\n');
    var index = -1;
    for (var i = 0; i < linelist.length; i++) {
        const tmp = linelist[i].split(' ');
        if (tmp[0] === '#') {
            continue;
        }
        const type = tmp.shift();
        if (type === 'newmtl') {
            index += 1;
            object.material.push(tmp);
        } else if (type === 'Kd') {
            for (var j = 0; j < 3; j++) {
                tmp[j] = Number(tmp[j]);
            }
            object.material[index].push(tmp);
        }
    }
}

//parse obj without materials 
function parseOBJvf(text, object,scale) {
    const linelist = text.split('\n');
    var index = 0;
    for (var i = 0; i < linelist.length; i++) {
        const tmp = linelist[i].split(' ');
        if (tmp[0] === '#') {
            continue;
        }
        const type = tmp.shift();
        if (type === 'v') {
            for (var j = 0; j < tmp.length; j++) {
                tmp[j] = Number(tmp[j]*scale);
            }
            object.vertices.push(tmp);
        }else if (type === 'f') {
            index += 1;
            var list = [];
            for (var j = 0; j < tmp.length; j++) {
                const e = tmp[j].split('/');
                for (var k = 0; k < e.length; k++) {
                    e[k] = Number(e[k] - 1);
                }
                list.push(e);
            }
            object.faces.push(list);

        }
    }

}
function createBufferArray(object) {
    var bufferArray = [];
    var index = 0;
    var material = object.materialid[0];
    var m = object.material.findIndex(function (a) { return a[0] === material });
    var r = object.material[m][1][0];
    var g = object.material[m][1][1];
    var b = object.material[m][1][2];
    for (var i = 0; i < object.faces.length; i++) {

        if (i == object.materialindex[index+1] && index<object.materialindex.length-1) {
            index += 1;
            material = object.materialid[index];
            m = object.material.findIndex(function (a) { return a[0] === material });
            r = object.material[m][1][0];
            g = object.material[m][1][1];
            b = object.material[m][1][2];
        }
        for (var j = 0; j < 3; j++) {
            var tmp = object.faces[i][j][0];
            for (var k = 0; k < 3; k++) {

                bufferArray.push(object.vertices[tmp][k]);

            }

            bufferArray.push(r, g, b);
        }

    }
    return bufferArray;
}


//calculate normal direction of given three vertices using vector math
function calculate_normals(object){
    var center=[0,0,0];
    for(var i=0;i<object.vertices.length;i++){
        vec3.add(center,center,object.vertices[i]);
    }
    vec3.scale(center,center,(1/object.vertices.length));
    var normals=[];
    for(var i=0;i<object.faces.length;i++){
        let A=object.vertices[object.faces[i][0][0]];
        let B=object.vertices[object.faces[i][1][0]];
        let C=object.vertices[object.faces[i][2][0]];
        var normal=[0,0,0];
        let BA=[0,0,0];
        vec3.sub(BA,B,A);
        let CB=[0,0,0];
        vec3.sub(CB,C,B);
        vec3.cross(normal,BA,CB);
        vec3.normalize(normal,normal);
        let ABC=[0,0,0];
        vec3.add(ABC,A,B);
        vec3.add(ABC,ABC,C);
        vec3.scale(ABC,ABC,1/3);
        let ABCO=[0,0,0];
        vec3.sub(ABCO,center,ABC);
        vec3.normalize(ABCO,ABCO);
        normals.push(normal);
    } 
    return normals;
}