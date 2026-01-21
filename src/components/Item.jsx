const Item = ({ asignatura, estado, strikethrough }) => {
  return (
    <span className={strikethrough ? "item-strikethrough" : ""}>
      {asignatura}
      {estado && (
        <span style={{ marginLeft: "10px", color: "#888" }}>{estado}</span>
      )}
    </span>
  );
};

export default Item;
