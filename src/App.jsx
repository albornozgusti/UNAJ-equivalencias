import { useState } from "react";
import "./App.css";
import Item from "./components/Item.jsx";
import equivalencias from "./data/equivalencias.json";

function App() {
  const { nuevo_plan, plan_2014 } = equivalencias;
  const [plan2014List, setPlan2014List] = useState(
    plan_2014.map((year) => ({
      ...year,
      asignaturas: year.asignaturas.map((asig) => ({ ...asig, checked: false })),
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

  return (
    <div className="App">
      <div>
        <h2>Plan 2014 (Selecciona asignaturas)</h2>
        {plan2014List.map((item) => (
          <>
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
          </>
        ))}
      </div>
      <div>
        <h2>Nuevo Plan (Equivalencias)</h2>
        {nuevo_plan.length > 0 ? (
          nuevo_plan.map((year) => (
            <>
              <h3>{year.anio}</h3>
              {year.asignaturas.map((item) => {
                const isChecked =
                  item.equivalencias_codigos.length > 0 &&
                  item.equivalencias_codigos.every((codigo) =>
                    plan2014List.some((p14Year) =>
                      p14Year.asignaturas.some(
                        (p14Item) =>
                          p14Item.codigo === codigo && p14Item.checked,
                      ),
                    ),
                  );
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
            </>
          ))
        ) : (
          <p>No hay items disponibles</p>
        )}
      </div>
    </div>
  );
}

export default App;
