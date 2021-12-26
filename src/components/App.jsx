import React, { useEffect, useState } from "react";
import InputArea from "./InputArea";
import TodoList from "./TodoItem";

var axios = require("axios");

var FormData = require("form-data");
var data = new FormData();
// var config = {
//   method: "get",
//   url: "https://devza.com/tests/tasks/listusers",
//   headers: {
//     AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a",
//   },
// };
// listusers,create,update,delete,list

const apikey = "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a";

function delet(id) {
  data.append("taskid", `${id}`);
}

// new Date(year, month, day, hours, minutes, seconds, milliseconds);
function App() {
  const d = new Date();
  function api({
    url,
    message,
    due_date = `${d.getFullYear()}-${d.getMonth()}-${d.getDay()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
    id,
  }) {
    // const check = data && [...data.getHeaders()];
    if (url === "create" || url === "update") {
      data.append("message", message);
      data.append("due_date", due_date);
      data.append("priority", "1");
      data.append("assigned_to", "1");
      url === "update" && data.append("taskid", id);
    } else if (url === "delete") {
      data.append("taskid", id);
    }

    var config = {
      method: url === "listusers" || url === "list" ? "get" : "post",
      url: `https://devza.com/tests/tasks/${url}`,
      headers: {
        AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a",
        // ...check,
      },
      data: data && data,
    };
    axios(config)
      .then((response) =>
        url === "listusers" || url === "list"
          ? setItem(JSON.parse(JSON.stringify(response.data.tasks)))
          : //console.log(JSON.parse(JSON.stringify(response.data.tasks)))
            // .json()
            // .filter((dat) => assigned_name === "Arpit")
            console.log(JSON.stringify(response.data))
      )
      .catch((error) => error);
  }
  useEffect(() => {
    api({ url: "list" });
  }, []);
  const [text, setInput] = useState("");
  const [items, setItem] = useState([]);

  const updateItem = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  function addItems() { 
    setItem((preV) => [...preV, text]);
    setInput(" ");
  }

  function deleteItem(id, it) {
    setItem((preV) => preV.filter((item) => item.id !== id));
    api({ url: "delete", id: id });
  }

  const keyPress = (e) => {
    const { key } = e;
    return key === "Enter" && addItems();
  };
  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea
        onPressed={keyPress}
        onChange={updateItem}
        value={text}
        onClick={addItems}
      />
      <div>
        <ul>
          {items.map((item, index) => (
            <TodoList
              key={index}
              it={index}
              id={item.id}
              onChecked={deleteItem}
              list={item.message}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
