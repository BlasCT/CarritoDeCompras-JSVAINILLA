const contenedorProductos = document.querySelector("#contenedor-productos");
const fragment = document.createDocumentFragment();
const template = document.querySelector("#template-productos").content;
const templateCarrito = document.querySelector("#template-carrito").content;
const templateFooter = document.querySelector("#template-footer").content;

const items = document.querySelector("#items");
const footer = document.querySelector("#footer");

let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const fetchData = async () => {
  try {
    const response = await fetch("api.json");
    const data = await response.json();
    pintarProductos(data);
    btnButton(data);
  } catch (e) {
    console.log(e);
  }
};

const pintarProductos = (data) => {
  data.forEach((event) => {
    const clone = template.cloneNode(true);
    //no olvidar que sirve para traer las imagenes
    clone.querySelector("img").setAttribute("src", event.thumbnailUrl);
    clone.querySelector("h5").textContent = event.title;
    clone.querySelector("span").textContent = event.precio;
    clone.querySelector("button").dataset.id = event.id;
    fragment.appendChild(clone);
  });
  contenedorProductos.appendChild(fragment);
};

const btnButton = (data) => {
  const botones = document.querySelectorAll("button");
  botones.forEach((element) => {
    element.addEventListener("click", (event) => {
      console.log(event.target.getAttribute("data-id"));
      const producto = data.find(
        (item) => item.id === parseInt(event.target.getAttribute("data-id"))
      );
      producto.cantidad = 1;
      //hasOwnProperty sirve para comprobar si existe el producto
      if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
      }
      //Sirve para hacer una copia del producto
      carrito[producto.id] = { ...producto };
      pintarCarrito();
    });
  });
};

const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((event) => {
    const clone = templateCarrito.cloneNode(true);
    clone.querySelector("th").textContent = event.id;
    clone.querySelectorAll("td")[0].textContent = event.title;
    clone.querySelectorAll("td")[1].textContent = event.cantidad;

    //botones
    clone.querySelector(".btn-info").dataset.id = event.id;
    clone.querySelector(".btn-danger").dataset.id = event.id;

    clone.querySelector("span").textContent = event.precio * event.cantidad;
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  pintarFooter();
  accionBotones();
};

const pintarFooter = () => {
  footer.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
    <tr id="footer">
    <th scope="row" colspan="5">
      Carrito vacío - comience a comprar!
    </th>
  </tr>
    `;
    return;
  }

  const clone = templateFooter.cloneNode(true);
  //Sirve para sumar la cantidad total
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecioTotal = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  clone.querySelectorAll("td")[0].textContent = nCantidad;
  clone.querySelector("span").textContent = nPrecioTotal;

  fragment.appendChild(clone);
  footer.appendChild(fragment);
  const vaciarCarrito = document.querySelector("#vaciar-carrito");
  vaciarCarrito.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll("#items .btn-info");
  const botonesEliminar = document.querySelectorAll("#items .btn-danger");

  botonesAgregar.forEach((element) => {
    element.addEventListener("click", () => {
      carrito[element.getAttribute("data-id")].cantidad++;
      pintarCarrito();
    });
  });
  

  botonesEliminar.forEach((element) => {
    element.addEventListener("click", () => {
      carrito[element.getAttribute("data-id")].cantidad--;
      
     if(carrito[element.getAttribute("data-id")].cantidad-- === 0){
        delete carrito[element.getAttribute("data-id")]
     }else {
        carrito[element.getAttribute("data-id")].cantidad++
     }

      pintarCarrito();
    });
  });
};
