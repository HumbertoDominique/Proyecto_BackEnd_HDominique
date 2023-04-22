const fs = require("fs");

class ProductManager {
  #id = 0;

  constructor(ruta) {
    this.path = ruta;

    fs.writeFileSync(`${this.path}`, JSON.stringify([]));
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const productosGuardados = await this.getProducts();

      const producto = {
        title, //NOMBRE DEL PRODUCTO
        description, //DESCRIPCIÓN DEL PRODUCTO
        price, //PRECIO
        thumbnail, //RUTA DE IMAGEN
        code, //CÓDIGO IDENTIFICADOR
        stock, //NÚMERO DE PIEZAS DISPONIBLES
      };

      const codigoDuplicado = productosGuardados.findIndex(
        (producto) => producto.code === code
      );

      const valoresProductos = Object.values(producto);

      if (valoresProductos.includes(undefined)) {
        console.log(
          "\nTodos los campos son obligatorios para agregar productos.\n"
        );
      } else if (codigoDuplicado != -1) {
        console.log(
          "\nSe ha detectado que el siguiente código está duplicado:"
        );
        console.log(producto.code);
      } else {
        producto.id = this.#getId();
        productosGuardados.push(producto);
      }

      await fs.promises.writeFile(
        `${this.path}`,
        JSON.stringify(productosGuardados)
      );
    } catch (err) {
      console.log("Error durante la lectura inicial de productos");
    }
  }

  #getId() {
    this.#id++;
    return this.#id;
  }

  async getProducts() {
    try {
      const productosGuardados = await fs.promises.readFile(
        `${this.path}`,
        "utf-8"
      );
      return JSON.parse(productosGuardados);
    } catch (err) {
      console.log("Error durante la revisión de los productos");
    }
  }

  async getProductsById(idProducto) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      if (productsIndex === -1) {
        ("/n");
        console.log("El producto que está tratando de buscar no existe.");
      } else {
        ("/n");
        console.log("El producto que está buscando por id es:");
        console.log(productosGuardados[productsIndex]);
      }
    } catch (err) {
      console.log("Error al buscar producto por su id");
    }
  }

  async updateProduct(idProducto, modificacion) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      if (productsIndex === -1) {
        console.log("El producto que está tratando de modificar no existe.");
      } else {
        let objetoModificacion = modificacion;

        let { id } = productosGuardados[productsIndex];

        let update = {
          ...productosGuardados[productsIndex],
          ...objetoModificacion,
          id,
        };

        productosGuardados[productsIndex] = update;

        await fs.promises.writeFile(
          `${this.path}`,
          JSON.stringify(productosGuardados)
        );

        console.log("El producto modificado es el siguiente: \n", update);
      }
    } catch (err) {
      console.log("Error al modificar el producto");
    }
  }

  async deleteProduct(idProducto) {
    try {
      const productosGuardados = await this.getProducts();

      const productsIndex = productosGuardados.findIndex(
        (producto) => producto.id === idProducto
      );

      if (productsIndex === -1) {
        console.log("El producto que está tratando de borrar no existe.");
      } else {
        console.log(
          "\nProducto eliminado con el siguiente id:",
          productosGuardados[productsIndex].id
        );
        console.log(
          "Nombre del producto: ",
          productosGuardados[productsIndex].title,
          "\n"
        );

        productosGuardados.splice(productsIndex, 1);

        await fs.promises.writeFile(
          `${this.path}`,
          JSON.stringify(productosGuardados)
        );
      }
    } catch (err) {
      console.log("Error al buscar producto por su id");
    }
  }
}

//TESTING DEL DESAFÍO.

const productManager = new ProductManager("./check.json");

const test = async () => {
  try {
    console.log(await productManager.getProducts());

    await productManager.addProduct(
      "ProductoB",
      "DEF",
      "2000",
      "Con Imagen",
      "abc123",
      "20"
    );

    await productManager.addProduct(
      "ProductoC",
      "DEF",
      "2000",
      "Con Imagen",
      "abc124",
      "20"
    );

    await productManager.addProduct(
      "ProductoD",
      "DEF",
      "2000",
      "Con Imagen",
      "abc125",
      "20"
    );

    console.log(await productManager.getProducts());

    await productManager.getProductsById(3);

    await productManager.updateProduct(2, {
      title: "PROBANDOO",
      description: "9999",
      price: 9999,
      id: 66,
    });

    await productManager.updateProduct(1, {
      title: "SE MODIFICÓ",
      description: "SE MODIFICÓ",
      price: "SE MODIFICÓ",
      id: 66,
    });

    await productManager.deleteProduct(1);
  } catch (err) {
    console.log("Salio mal el Test");
  }
};

test();
