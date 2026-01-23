import { useState } from "react";
import "./App.css";
import Item from "./components/Item.jsx";
import equivalencias from "./data/equivalencias.json";

function App() {
  const { nuevo_plan, plan_2014 } = equivalencias;
  const [plan2014List, setPlan2014List] = useState(
    plan_2014.map((year) => ({
      ...year,
      asignaturas: year.asignaturas.map((asig) => ({
        ...asig,
        checked: false,
      })),
    })),
  );

  const handleCheckChange = (id) => {
    setPlan2014List((prevList) =>
      prevList.map((year) => ({
        ...year,
        asignaturas: year.asignaturas.map((asig) =>
          asig.id === id ? { ...asig, checked: !asig.checked } : asig,
        ),
      })),
    );
  };

  const totalPlan2014 = plan2014List.reduce(
    (acc, year) =>
      acc +
      year.asignaturas.filter((a) => a.cuatrimestre !== "Optativa").length,
    0,
  );
  const checkedPlan2014 = plan2014List.reduce(
    (acc, year) =>
      acc +
      year.asignaturas.filter((a) => a.cuatrimestre !== "Optativa" && a.checked)
        .length,
    0,
  );
  const remainingPlan2014 = totalPlan2014 - checkedPlan2014;

  const totalNuevoPlan = nuevo_plan.reduce(
    (acc, year) =>
      acc +
      year.asignaturas.filter((a) => a.cuatrimestre !== "Optativa").length,
    0,
  );

  const checkedNuevoPlan = nuevo_plan.reduce((acc, year) => {
    return (
      acc +
      year.asignaturas.filter((item) => {
        if (item.cuatrimestre === "Optativa") return false;
        const equivalenciasCodeigos = item.equivalencias_codigos || [];
        return (
          equivalenciasCodeigos.length > 0 &&
          equivalenciasCodeigos.every((codigo) =>
            plan2014List.some((p14Year) =>
              p14Year.asignaturas.some(
                (p14Item) => p14Item.codigo === codigo && p14Item.checked,
              ),
            ),
          )
        );
      }).length
    );
  }, 0);

  const remainingNuevoPlan = totalNuevoPlan - checkedNuevoPlan;

  const totalTituloIntermedio = nuevo_plan.reduce(
    (acc, year) =>
      acc +
      year.asignaturas.filter((a) => a.titulo_intermedio === "true" || a.titulo_intermedio === true).length,
    0,
  );

  const checkedTituloIntermedio = nuevo_plan.reduce((acc, year) => {
    return (
      acc +
      year.asignaturas.filter((item) => {
        if (item.titulo_intermedio !== "true" && item.titulo_intermedio !== true) return false;
        const equivalenciasCodeigos = item.equivalencias_codigos || [];
        if (equivalenciasCodeigos.length > 0) {
          return equivalenciasCodeigos.every((codigo) =>
            plan2014List.some((p14Year) =>
              p14Year.asignaturas.some(
                (p14Item) => p14Item.codigo === codigo && p14Item.checked,
              ),
            ),
          );
        } else if (item.codigo) {
          return plan2014List.some((p14Year) =>
            p14Year.asignaturas.some(
              (p14Item) =>
                p14Item.codigo === item.codigo && p14Item.checked,
            ),
          );
        }
        return false;
      }).length
    );
  }, 0);

  const tituloIntermedioCompleted = totalTituloIntermedio > 0 && totalTituloIntermedio === checkedTituloIntermedio;

  return (
    <div className="App">
      <div>
        <h2>Plan 2014 (Selecciona asignaturas)</h2>
        <div className="list-content">
          {plan2014List.map((item) => (
            <div key={item.anio}>
              <h3>{item.anio}</h3>
              {item.asignaturas.map((asig) => (
                <div key={asig.id} style={{ marginBottom: "8px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={asig.checked}
                      onChange={() => handleCheckChange(asig.id)}
                    />
                    <Item asignatura={asig.asignatura} />
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="list-counter">
          Materias restantes (plan 2014): <strong>{remainingPlan2014}</strong>{" "}
          de {totalPlan2014}
        </div>
      </div>
      <div>
        <h2>Nuevo Plan (Equivalencias)</h2>
        <div className="list-content">
          {nuevo_plan.length > 0 ? (
            nuevo_plan.map((year) => (
              <div key={year.anio}>
                <h3>{year.anio}</h3>
                {year.asignaturas.map((item) => {
                  const equivalenciasCodeigos =
                    item.equivalencias_codigos || [];
                  let isChecked = false;

                  if (equivalenciasCodeigos.length > 0) {
                    // Para materias con equivalencias, verificar si todos los códigos están seleccionados
                    isChecked = equivalenciasCodeigos.every((codigo) =>
                      plan2014List.some((p14Year) =>
                        p14Year.asignaturas.some(
                          (p14Item) =>
                            p14Item.codigo === codigo && p14Item.checked,
                        ),
                      ),
                    );
                  } else if (item.codigo) {
                    // Para optativas sin equivalencias, verificar si el código coincide directamente
                    isChecked = plan2014List.some((p14Year) =>
                      p14Year.asignaturas.some(
                        (p14Item) =>
                          p14Item.codigo === item.codigo && p14Item.checked,
                      ),
                    );
                  }

                  return (
                    <div key={item.id} style={{ marginBottom: "8px" }}>
                      <Item
                        asignatura={item.asignatura}
                        estado={item.estado_equivalencia}
                        strikethrough={isChecked}
                      />
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <p>No hay items disponibles</p>
          )}
        </div>
        <div className="list-counter">
          Materias restantes (Nuevo plan): <strong>{remainingNuevoPlan}</strong>{" "}
          de {totalNuevoPlan}
        </div>
        {tituloIntermedioCompleted && (
          <div className="titulo-intermedio-message">
            ✓ Obtención de título intermedio
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
