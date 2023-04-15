/* VARIABLES PARA VALIDACIÓNES */
const d = document,
  $rangeInput = d.getElementById("round-input"),
  $rangeElementValue = d.getElementById("round-value"),
  $EquationInput = d.getElementById("input-equation"),
  $x0value = d.getElementById("value-x-input"),
  $torelanceInput = d.getElementById("tolerance-input"),
  $form = d.getElementById("form");

let ctrsPermitidosEq = /^[1234567890.E+\-/*^()x]+$/,
  ctrsPermitodosNums = /^(-)?\d+(\.\d+)?$/,
  ctrsPermitodosNumsPos = /^(?!.*\.(\.|$))[0-9]*(\.[0-9]+)?$/;

/* VARIABLES ALGORITMO */
const  $tbody = d.getElementById("tbody"),
$spanDerivative = d.getElementById("span-derivative"),
$spanFunction = d.getElementById("span-function"),
$spanValueX = d.getElementById("span-x"),
$divCapaVacia = d.querySelector(".result-empty"),
$loadingResults = d.querySelector(".result-loading"),
$Modal = new bootstrap.Modal(document.getElementById('modal-msg')),
$ModalError = new bootstrap.Modal(document.getElementById('modal-msg-error'));





/* ------------------VALIDACIONES---------------------- */

const toleranciaValida = (tolerancia) => {
  let numTol = Number(tolerancia);
  if (typeof numTol === "number" && numTol > 0) {
    return true;
  } else {
    return false;
  }
};


const validarEcuacion = () => {
  const ecuacion = $EquationInput.value;
  if (ctrsPermitidosEq.test(ecuacion)) {
    $EquationInput.classList.remove("is-invalid");
    d.getElementById("validation-equation").textContent = "";
    return true;
  } else {
    $EquationInput.classList.add("is-invalid");
    d.getElementById("validation-equation").textContent =
      "Solo se permiten valores: '1234567890.E+-/*^()x'";
    return false;
  }
};

const validarValorX = () => {
  const valorX = $x0value.value;
  if (ctrsPermitodosNums.test(valorX) && typeof Number(valorX) === "number") {
    d.getElementById("validation-value-x").textContent = "";
    $x0value.classList.remove("is-invalid");
    return true;
  } else {
    $x0value.classList.add("is-invalid");
    d.getElementById("validation-value-x").textContent = "Solo números";
    return false;
  }
};

const validarTolerancia = () => {
  const valorTolerancia = $torelanceInput.value;
  if (
    ctrsPermitodosNumsPos.test(valorTolerancia) &&
    toleranciaValida(valorTolerancia)
  ) {
    d.getElementById("validation-tolerance").textContent = "";
    $torelanceInput.classList.remove("is-invalid");
    return true;
  } else {
    d.getElementById("validation-tolerance").textContent =
      "Solo números positivos";
    $torelanceInput.classList.add("is-invalid");
    return false;
  }
};

const validarDatos = () => {
  //Validar input
  if (validarValorX() && validarTolerancia()) {
    return true;
  } else {
    return false;
  }
};

$rangeInput.addEventListener("input", () => {
  $rangeElementValue.textContent = $rangeInput.value;
});

/* Validacion Ecuación */
$EquationInput.addEventListener("change", (e) => {
  const valueInput = $EquationInput.value;

  if (!ctrsPermitidosEq.test(valueInput)) {
    //e.target.value = valueInput.slice(0, valueInput.length-1);
    d.getElementById("validation-equation").textContent = "Solo se permiten valores: '1234567890.E+-/*^()x'";
  } else {
    d.getElementById("validation-equation").textContent = "";
  }
});

/* Validacion Valor de x0 */
$x0value.addEventListener("change", (e) => {
  const valueInput = $x0value.value;

  if (!ctrsPermitodosNums.test(valueInput)) {
    //e.target.value = valueInput.slice(0, valueInput.length-1);
    d.getElementById("validation-value-x").textContent = "Solo números";
  } else {
    d.getElementById("validation-value-x").textContent = "";
  }
});

/* Validación Tolerancia */
$torelanceInput.addEventListener("change", (e) => {
  const valueInput = $torelanceInput.value;
  if (
    !ctrsPermitodosNumsPos.test(valueInput) ||
    !toleranciaValida(valueInput)
  ) {
    //e.target.value = valueInput.slice(0, valueInput.length-1);
    d.getElementById("validation-tolerance").textContent = "Solo números positivos";
  } else {
    d.getElementById("validation-tolerance").textContent = "";
  }
});

/* ------------------ TERMINAN VALIDACIONES---------------------- */

/* ------------------ALGORITMO---------------------- */
const formatearNumero = (numero) => {
    // Convertir el número a una cadena de texto
    const numeroTexto = numero.toString();
    
    // Comprobar si la cadena de texto contiene la letra "e"
    if (numeroTexto.includes("e")) {
      // Utilizar toLocaleString para formatear el número con ceros
      return numero.toLocaleString(undefined, {minimumFractionDigits: 0});
    } else {
      // Si no hay "e", devolver el número sin cambios
      return numero;
    }
};

const Algoritmo = (exprf, xf, roundf, tolerancef) => {
    const expr = exprf;
    let x = xf;
    const round = roundf;
    const tolerance = tolerancef;

    const maxIterations = 100;
    let iteration = 0;  
    let f = 99999;//Resultado de la funcion

    const $fragmento = d.createDocumentFragment();
    $tbody.innerHTML = "";

    const derivada = math.derivative(expr, 'x');
    const funcion = math.parse(expr);

    const isWithinTolerance = (num) => {
        return Math.abs(num) < tolerance;
    };

    /* Para mostrar resultados */
    

    while (!isWithinTolerance(f) && iteration < maxIterations) {
        /* Calcular valor de f(x) */
        f = funcion.evaluate({x});//x -> x0

        /* Calcular valor de f'(x) */
        let fd = derivada.evaluate({ x });

        /* formula */
        x = x - f / fd;

        iteration++;
        //console.log(`x${iteration}     x: ${math.round(x, round)}      f(x): ${math.round(f,round + 1)}`);

        /* HTML para mostrar resultados */
        const tr = d.createElement('tr'),
        th = d.createElement('th'),
        td1 = d.createElement('td'),
        td2 = d.createElement('td');

        th.textContent = `x${iteration}`;
        th.scope = "row";

        td1.textContent = `${formatearNumero(math.round(x, round))}`;
        td2.textContent = `${formatearNumero(math.round(f,round + 1))}`;

        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);

        $fragmento.appendChild(tr);
    }

    $spanValueX.textContent = `${math.round(x, round)}`;
    $spanDerivative.textContent = `${derivada.toString()}`;
    $spanFunction.textContent = `${funcion.toString()}`;
    $tbody.appendChild($fragmento);

    if (isWithinTolerance(f)) {
        
        /* Mostrar modal con mensaje de resultado */
        $Modal.show();
    } else {
        
        $ModalError.show();
    }
};

/* -------------------------TERMINA ALGORITMO-------------------- */

/* GRAFICA */
const draw = (expr)=> {
  try {
    functionPlot({
      title: "Grafica de función",
      target: "#grafic",
      grid: true,
      width: 444,
      height: 526,
      disableZoom: true,
      color: 'orange',
      xAxis: {
        label: "x - axis",
        domain: [-6, 6],
        color: 'white', // Configurar color de las líneas y números en blanco
        tickColor: 'white' // Configurar color de las líneas y números en blanco
      },
      yAxis: {
        label: "y - axis",
        color: 'white', // Configurar color de las líneas y números en blanco
        tickColor: 'white' // Configurar color de las líneas y números en blanco
      },
      data: [
        {
          fn: expr,
          color: "orange" // Configurar color de la línea generada en "#1977F2"
        },
      ],
    });
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

const dibujarGrafica = (expr)=>{
    const funcion = math.parse(expr);
    draw(funcion.toString());
}

/* -----------------------TERMINA GRAFICA */

$form.addEventListener("submit", (e) => {
  $divCapaVacia.classList.remove("active");
  e.preventDefault();
  if (validarDatos()) {
    $loadingResults.classList.add("active");
    //Llamar al algoritmo
    const exprf = $EquationInput.value;
    const xf = Number($x0value.value);
    const roundf = Number($rangeInput.value);
    const tolerancef = Number($torelanceInput.value);



    console.log("");
    console.log("------------------------------------------------------------");
    console.log("Aplicación desarrollada  para la materia de Matematicas  para Ingenieria II con el Tema 'Metodos Numericos - Método de Newton Rapshon'");
    console.log("INTEGRANTES:");
    console.log("Enrique Ramos Regente - Diseñador");
    console.log("Juan Daniel Espíndola Pérez - Desarrollador");
    console.log("Ricardo Lara Arenas - Algoritimo");
    console.log("------------------------------------------------------------");
    console.log("");


    Algoritmo(exprf, xf, roundf, tolerancef);
    dibujarGrafica(exprf);
    $loadingResults.classList.remove("active");
  }
});
