const fs = require('fs');
class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo
        this.extencion = '.txt'
        fs.createWriteStream(`./${this.nombreArchivo}${this.extencion}`, 'utf-8')
    }

    async save(objet) {
        if (fs.existsSync(`./${this.nombreArchivo}${this.extencion}`)) {
            let array = []
            await fs.promises.readFile(`./${this.nombreArchivo}${this.extencion}`, 'utf-8')
            .then(async result => {
                let ultimoId = 0;
                //se valida si tiene contenido el archivo y convierte contenido a json array
                if (result) {
                    array = JSON.parse(result)
                    array.forEach(element => {
                        ultimoId = element.id;
                    })
                } else {
                    array = []
                }
                objet.id = ++ultimoId;
                array.push(objet)
                try {
                    await fs.promises.writeFile(`./${this.nombreArchivo}${this.extencion}`, JSON.stringify(array))
                } catch (err) {
                    reject(err)
                }
            })
            .catch(err => {
                console.log(err)
            })
            return objet.id
        }else{
            return 'No existe el archivo'
        }
    }

    async getById(id) {
        let objet
        await fs.promises.readFile(`./${this.nombreArchivo}${this.extencion}`, 'utf-8')
            .then(result => {
                if (result) {
                    let array = JSON.parse(result)
                    array.forEach(x => {
                        if (x.id == id){
                            objet = x
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        //se valida si el objeto si existe
        if (objet === undefined) {
            return {error:'producto no encontrado'}
            // return null
        } else {
            return objet
        }
    }

    async getAll() {
        let array = []
        await fs.promises.readFile(`./${this.nombreArchivo}${this.extencion}`, 'utf-8')
            .then(async result => {
                //se valida que ayan datos
                if (result) {
                    array = JSON.parse(result)
                }
            })
            .catch(err => {
                console.log(err)
            })

        return array
    }

      
    async updateById(objectUpd) {
        let objet
        return new Promise(async (resolve, reject) => {
            let array = await this.getAll()
            let objeto = array.find(x=>x.id === objectUpd.id)
            //se valida que el ojeto exista
            const index = array.indexOf(objeto);
            if (index > -1) {
                array[index].title = objectUpd.title
                array[index].price = objectUpd.price
                array[index].thumbnail = objectUpd.thumbnail
                objet = array[index]
                try {
                    await fs.promises.writeFile(`./${this.nombreArchivo}${this.extencion}`, JSON.stringify(array))
                    resolve(objet)

                } catch (err) {
                    reject(err)
                }
            } else {
                resolve(null)
            }
        })
    }

    async deleteById(id) {
        return new Promise(async (resolve, reject) => {
            let array = await this.getAll()
            let objeto = array.find(x=>x.id === id)
            //se valida que el ojeto exista
            const index = array.indexOf(objeto);
            if (index > -1) {
                array.splice(index, 1)
                try {
                    await fs.promises.writeFile(`./${this.nombreArchivo}${this.extencion}`, JSON.stringify(array))
                    resolve('objeto eliminado')
                } catch (err) {
                    reject(err)
                }
            } else {
                resolve('no existe el objeto en el archivo')
            }
        })
    }

   async deleteAll() {
        return new Promise(async (resolve, reject) => {
            try {
                await fs.promises.writeFile(`./${this.nombreArchivo}${this.extencion}`, '')
                resolve('objetos eliminados')
            } catch (err) {
                reject(err)
            }
        })
    }

}

module.exports = Contenedor
// let contenedorDeProductos = new Contenedor("productos")
// let prueba = async () => {
//     console.log(await contenedorDeProductos.save({ title: "papa", price: 251291.32, thumbnail: "https://www.infobae.com/new-resizer/rJPvFqJ0gbw7oH7lWvfGwJxcN3A=/992x606/filters:format(webp):quality(85)/cloudfront-us-east-1.images.arcpublishing.com/infobae/E7U6CHWZRBFCPN2ESFNKXYFO4U.jpeg", id: 0 }))// console.log(contenedor.getId(1))
    
//     console.log(await contenedorDeProductos.save({ title: "yuca", price: 251291.32, thumbnail: "https://www.infobae.com/new-resizer/rJPvFqJ0gbw7oH7lWvfGwJxcN3A=/992x606/filters:format(webp):quality(85)/cloudfront-us-east-1.images.arcpublishing.com/infobae/E7U6CHWZRBFCPN2ESFNKXYFO4U.jpeg", id: 0 }))// console.log(contenedor.getId(1))
    
//     console.log(await contenedorDeProductos.getById(1))

//     console.log(await contenedorDeProductos.getAll())

//     await contenedorDeProductos.deleteById(1)
//         .then(console.log)
//         .catch(console.log)

//     console.log(await contenedorDeProductos.getAll())

//     await contenedorDeProductos.deleteAll()
//         .then(console.log)
//         .catch(console.log)

//     console.log(await contenedorDeProductos.getAll())
// }

// prueba()