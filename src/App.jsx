import { useState, useMemo } from "react";
import "./App.css";
import Item from "./components/Item.jsx";
import equivalencias from "./data/equivalencias.json";

function App() {
  const { nuevo_plan, plan_2014 } = equivalencias;
  const [plan2014List, setPlan2014List] = useState(
    plan_2014.map((item) => ({ ...item, checked: false })),
  );

  // Obtener IDs de plan 2014 marcados
  const checkedPlan2014Ids = useMemo(() => {
    return plan2014List
      .filter((item) => item.checked)
      .map((item) => item.codigo);
  }, [plan2014List]);

  // Filtrar nuevo_plan para mostrar solo equivalencias de códigos marcados
  const nuevoPlanList = useMemo(() => {
    return nuevo_plan.filter((item) =>
      checkedPlan2014Ids.includes(item.codigo),
    );
  }, [checkedPlan2014Ids]);

  const handleCheckChange = (id) => {
    setPlan2014List((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  return (
    <div className="App">
      <div>
        <h2>Plan 2014 (Selecciona asignaturas)</h2>
        {plan2014List.map((item) => (
          <div key={item.id} style={{ marginBottom: "8px" }}>
            <label>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckChange(item.id)}
              />
              <Item asignatura={item.asignatura} />
            </label>
          </div>
        ))}
      </div>
      <div>
        <h2>Nuevo Plan (Equivalencias)</h2>
        {nuevo_plan.length > 0 ? (
          nuevo_plan.map((item) => {
            const isChecked = plan2014List.some(
              (p14Item) => p14Item.codigo === item.codigo && p14Item.checked,
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
          })
        ) : (
          <p>No hay items disponibles</p>
        )}
      </div>
    </div>
  );
}

export default App;
