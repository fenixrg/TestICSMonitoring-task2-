import React, { Component, Fragment, useState } from "react";
import { Table } from "react-bootstrap";
import "./App.css";
import { Trash, Plus, Pencil } from "react-bootstrap-icons";
import $ from "jquery";

const EditableTable = ({ headers, rows, stateDate }) => {
  const [rowsState, setRowsState] = useState(rows);
  const [isnewRowsState, issetNewRowsState] = useState(false);
  const [stateRowData, setModalState] = useState(stateDate);
  const [maxID, issetMaxID] = useState(1);
  const [editDatarow, setEditDataRow] = useState();
  const [isEditDatarow, setIsEditDataRow] = useState(false);

  const handleRemoveRow = (rowID) => {
    const newData = rowsState.filter((row) => {
      return row.id !== rowID ? row : null;
    });

    setRowsState(newData);
    localStorage.setItem("newDataLS", JSON.stringify(newData));
  };

  const handleEditrow = (row) => {
    $(".modal-window").css("display", "block");
    setIsEditDataRow(true);
    setEditDataRow(row);
  };

  const handleAddrow = () => {
    $(".modal-window").css("display", "block");
  };

  class Form extends React.Component {
    state = stateRowData;

    handleChange = ({ target: { name, value } }) => {
      this.setState({
        [name]: value,
      });
    };

    handleShow = (evt) => {
      this.setState({
        inputUserRole: "value",
      });
      evt.preventDefault();
      const { inputName, inputDate, inputEmail, inputUserRole } = this.state;

      let maxID = 1;
      rowsState.forEach((row) => {
        if (row.id > maxID) {
          maxID = row.id;
        }
      });
      let newData = rowsState.map((row) => {
        return row;
      });

      newData.push({ id: maxID + 1, email: inputEmail, date: inputDate, name: inputName, role: inputUserRole });
      setRowsState(newData);
      localStorage.setItem("newDataLS", JSON.stringify(newData));
      console.log(newData);
    };

    handleUpdate = () => {
      const { inputName, inputDate, inputEmail, inputUserRole } = this.state;
      const newData = rowsState.filter((row) => {
        return row.id !== editDatarow.id ? row : { id: editDatarow.id, email: inputEmail, date: inputDate, name: inputName, role: inputUserRole };
      });
      setRowsState(newData);
    };

    handleHide = () => {
      $(".modal-window").css("display", "none");
    };

    render() {
      const { inputName, inputDate, inputEmail, inputUserRole } = this.state;
      return (
        <form className="modal-window">
          <h2 className="modal-window__title">Модальное окно</h2>
          <div className="modal-window__inputs">
            <fieldset className="modal-window__input-item">
              <label htmlFor="email">E-mail:</label>
              {isEditDatarow ? (
                <input type="email" name="inputEmail" id="email" value={editDatarow.email} onChange={this.handleChange} placeholder="test@gmail.com"></input>
              ) : (
                <input type="email" name="inputEmail" id="email" value={inputEmail} onChange={this.handleChange} placeholder="test@gmail.com"></input>
              )}
            </fieldset>
            <fieldset className="modal-window__input-item">
              <label htmlFor="date">Date:</label>
              {isEditDatarow ? <input type="date" name="inputDate" id="date" value={editDatarow.date} onChange={this.handleChange} placeholder="28.03.2022"></input> : <input type="date" name="inputDate" id="date" value={inputDate} onChange={this.handleChange} placeholder="28.03.2022"></input>}
            </fieldset>
            <fieldset className="modal-window__input-item">
              <label htmlFor="name">Name:</label>
              {isEditDatarow ? (
                <input type="text" name="inputName" id="name" value={editDatarow.name} onChange={this.handleChange} placeholder="Gasanov Ruslan Namikovich"></input>
              ) : (
                <input type="text" name="inputName" id="name" value={inputName} onChange={this.handleChange} placeholder="Gasanov Ruslan Namikovich"></input>
              )}
            </fieldset>
            <fieldset className="modal-window__input-item">
              <label htmlFor="userrole">User role:</label>
              {isEditDatarow ? (
                <input type="text" name="inputUserRole" id="userrole" value={editDatarow.role} onChange={this.handleChange} placeholder="Admin"></input>
              ) : (
                <input type="text" name="inputUserRole" id="userrole" value={inputUserRole} onChange={this.handleChange} placeholder="Admin"></input>
              )}
            </fieldset>
            <div className="modal-window__buttons">
              {isEditDatarow ? <button onClick={this.handleUpdate}>Update row</button> : <button onClick={this.handleShow}>Add new row</button>}
              <button onClick={this.handleHide}>Close</button>
            </div>
          </div>
        </form>
      );
    }
  }

  return (
    <React.Fragment>
      <h1>База данных пользователей</h1>
      <Table striped bordered hover className="table">
        <thead>
          <tr>
            {headers.map((header) => {
              return <th key={header.field}>{header.fieldName}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rowsState.map((row) => {
            return (
              <tr key={row.id}>
                <td>{row.email}</td>
                <td>{row.date}</td>
                <td>{isnewRowsState && row.id === maxID + 1 ? <input></input> : row.name}</td>
                <td>{row.role}</td>
                <td>
                  <button onClick={() => handleRemoveRow(row.id)} className="custom-table__action-btn">
                    <Trash />
                  </button>
                </td>

                <td>
                  <button onClick={() => handleAddrow(row.id)} className="custom-table__action-btn">
                    <Plus />
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEditrow(row)} className="custom-table__action-btn">
                    <Pencil />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Form />
    </React.Fragment>
  );
};

function App() {
  const headers = [
    { field: "email", fieldName: "E-mail" },
    { field: "date", fieldName: "Date" },
    { field: "name", fieldName: "Name" },
    { field: "role", fieldName: "User's role" },
    { field: "delete", fieldName: "Delete row" },
    { field: "add", fieldName: "Add row" },
    { field: "edit", fieldName: "Edit row" },
  ];
  let StateDate = {
    inputName: "",
    inputDate: "",
    inputEmail: "",
    inputUserRole: "",
  };
  const data = () => {
    if (typeof localStorage.newDataLS !== "undefined") {
      return JSON.parse(localStorage.getItem("newDataLS"));
    } else {
      return [
        { id: 1, email: "z@yandex.ru", date: "27.03.2022", name: "Gasanov Ruslan Namikovich", role: "Admin" },
        { id: 2, email: "x@yandex.ru", date: "28.03.2022", name: "Aleksandr Sergeevich Pushkin", role: "Admin" },
        { id: 3, email: "y@yandex.ru", date: "29.03.2022", name: "Antuan De Sent", role: "User" },
      ];
    }
  };
  return (
    <React.Fragment>
      <EditableTable headers={headers} rows={data} stateDate={StateDate} />
    </React.Fragment>
  );
}

export default App;
