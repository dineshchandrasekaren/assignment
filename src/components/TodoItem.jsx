import React, { useState } from "react";

function TodoList(props) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onDoubleClick={() => props.onChecked(props.id)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <li contentEditable={open} onChange={props.onChange}>{props.list}</li>
    </div>
  );
}

export default TodoList;
