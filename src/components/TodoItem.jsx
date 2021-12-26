import React from "react";

function TodoList(props) {
  return (
    <div onClick={() => props.onChecked(props.id,props.it)}>
      <li>{props.list}</li>
    </div>
  );
}

export default TodoList;
