const colors = ["#3b82f6", "#ff00cc", "#22c55e", "#f59e0b"];

const ColorPalette = () => {
  return (
    <div className="color-palette">
      {colors.map((color, index) => (
        <div
          key={index}
          className="color-circle"
          style={{ background: color }}
        />
      ))}
    </div>
  );
};

export default ColorPalette;