import React, { useEffect, useState } from "react";
import InputArea from "./InputArea";
import TodoList from "./TodoItem";

var axios = require("axios");

var FormData = require("form-data");
var data = new FormData();

const apikey = "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a";

// new Date(year, month, day, hours, minutes, seconds, milliseconds);
function App() {
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState(true);
  const d = new Date();
  function showLoadingSpinner() {
    setLoader(true);
    setList(false);
  }

  function hideLoadingSpinner() {
    setLoader(false);
    setList(true);
  }
  useEffect(() => {
    api({ url: "list" });
  }, [api]);
  function api({
    url,
    message,
    due_date = `${d.getFullYear()}-${d.getMonth()}-${d.getDay()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
    id,
  }) {
    showLoadingSpinner();
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
        ...data.getHeaders,
      },
      data: data && data,
    };
    axios(config)
      .then((response) => {
        if (url === "listusers" || url === "list") {
          setItem(JSON.parse(JSON.stringify(response.data.tasks)));
        } else {
          console.log(JSON.stringify(response.data));
        }
      })
      .then(() => hideLoadingSpinner())
      .catch((error) => error);
  }
  const [text, setInput] = useState("");
  const [items, setItem] = useState([]);

  const updateItem = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  function addItems() {
    api({ url: "create", message: text });
    setItem((preV) => [...preV, text]);
    setInput(" ");
  }

  function deleteItem(id) {
    setItem((preV) => preV.filter((item) => item.id !== id));
    api({ url: "delete", id });
  }
  function onEdit(e) {
    const { value } = e.target;
    setInput(value);
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
        <div
          style={{
            display: loader ? "none" : "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 300,
          }}
        >
          <span
            className="loader"
            style={{
              border: " 10px solid #f3f3ca",
              borderTop: "10px solid #333",
              width: 80,
              height: 80,
            }}
          />
        </div>
        <ul style={{ display: list ? "none" : "block" }}>
          {items.map((item, index) => (
            <TodoList
              key={index}
              it={index}
              id={item.id}
              onChange={onEdit}
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
