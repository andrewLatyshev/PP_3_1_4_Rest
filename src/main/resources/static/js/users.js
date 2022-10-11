const userAddFormId = $('#addForm');
const deleteFormId = $('#modalDelete');
const userTableId = $('#userTable');

function insertUser() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');

    let user = {
        'name': userAddFormId.find('#name').val(),
        'surname': userAddFormId.find('#surname').val(),
        'age': userAddFormId.find('#age').val(),
        'password': userAddFormId.find('#password').val(),
        'roles': userAddFormId.find('#newRoles')
            .val()
            // .map(function(val, index) {
            //     return {id:val, name:'Andrew'};
            // })
    }

    console.log(user);

    let request = new Request('/api/v1/admin/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(user)
    });

    fetch(request)
        .then( function (response)  {
            if(response.ok){
                console.info("User with id = " + user.id + " was inserted");
                sleep(200);
                $('#tableLink').trigger('click');
            } else {
                userAddFormId.find('#password').addClass('alert alert-danger');
            }
        });

}

function getAllUsers() {
    userTableId.children('#userTableBody').empty();
    fetch('/api/v1/admin').then(function (response) {
        if (response.ok) {
            response.json().then(users => {
                users.forEach(user => {
                    newRow(user);
                });
            });
        } else {
            console.error('Network request for users.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}

function newRow(user) {
    userTableId
        .append($('<tr class="border-top bg-light">').attr('id', 'userRow[' + user.id + ']')
            .append($('<td>').attr('id', 'userData[' + user.id + '][id]').text(user.id))
            .append($('<td>').attr('id', 'userData[' + user.id + '][name]').text(user.name))
            .append($('<td>').attr('id', 'userData[' + user.id + '][surname]').text(user.surname))
            .append($('<td>').attr('id', 'userData[' + user.id + '][age]').text(user.age))
            .append($('<td>').attr('id', 'userData[' + user.id + '][roles]').text(user.roles.map(role => role.name)))
            .append($('<td>').append($('<button class="btn btn-sm btn-info">')
                .click(() => {
                    loadModal(user.id);
                }).text('Edit')))
            .append($('<td>').append($('<button class="btn btn-sm btn-danger">')
                .click(() => {
                    loadModal(user.id, false);
                }).text('Delete')))
        );
}

function loadModal(id, editMode = true) {

    fetch('/api/v1/admin/form/' + id, {method: 'GET'})
        .then(function (response) {
                if (response.status !== 200) {
                    console.error('Looks like there was a problem. Status Code: ' + response.status);
                    if (response.status === 400) {
                        response.text().then((value) => console.warn("Error message: " + value));
                    }
                    return;
                }
                response.json().then(function (user) {

                    deleteFormId.find('#id').val(user.id);
                    deleteFormId.find('#name').val(user.name);
                    deleteFormId.find('#surname').val(user.surname);
                    deleteFormId.find('#age').val(user.age);
                    deleteFormId.find('#password').val(user.password);

                    if (editMode) {
                        deleteFormId.find('.modal-title').text('Edit user');
                        deleteFormId.find('#deleterButton').removeClass('btn-danger').addClass('btn-primary')
                            .removeAttr('value')
                            .attr('value', 'Edit')
                            .removeAttr('onClick')
                            .attr('onClick', 'editUser(' + id + ');');
                        Readonly(false);
                    } else {
                        deleteFormId.find('.modal-title').text('Delete user');
                        deleteFormId.find('#deleterButton').removeClass('btn-primary').addClass('btn-danger')
                            .removeAttr('value')
                            .attr('value', 'Delete')
                            .removeAttr('onClick')
                            .attr('onClick', 'deleteUser(' + id + ');');
                        Readonly();
                    }

                    fetch('/api/v1/admin/roles').then(function (response) {
                        if (response.ok) {
                            deleteFormId.find('#Roles').empty();
                            response.json().then(roleList => {
                                roleList.forEach(role => {
                                    deleteFormId.find('#Roles')
                                        .append($('<option>')
                                            .prop('selected', user.roles.filter(e => e.id === role.id).length)
                                            .val(role.id).text(role.name));
                                });
                            });
                        } else {
                            console.error('Network request for roles.json failed with response ' + response.status + ': ' + response.statusText);
                        }
                    });

                    deleteFormId.modal();
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });

}


function deleteUser(id) {
    fetch('/api/v1/admin/delete/' + id, {method: 'DELETE'})
        .then(function (response) {
            deleteFormId.modal('hide');
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                return;
            }
            console.info("User with id = " + id + " was deleted");
        });

    deleteFormId.modal('hide');
    userTableId.find('#userRow\\[' + id + '\\]').remove();


}

function editUser(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');

    let user = {
        'id' : deleteFormId.find('#id').val(),
        'name': deleteFormId.find('#name').val(),
        'surname': deleteFormId.find('#surname').val(),
        'age': deleteFormId.find('#age').val(),
        'password': deleteFormId.find('#password').val(),
        'roles': deleteFormId.find('#Roles')
            .val()
            .map(function(val, index){
                return {id:index+1, name:val};
            })
    }

    console.log(user);
    let request = new Request('/api/v1/admin/update', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(user)
    });

    fetch(request)
        .then( function (response) {
            if (response.ok) {
                console.info("User with id = " + user.id + " was edited");
            }
        });


    deleteFormId.modal('hide');
    sleep(200);
    getAllUsers();

}


function Readonly(value = true) {
    deleteFormId.find('#name').prop('readonly', value);
    deleteFormId.find('#surname').prop('readonly', value);
    deleteFormId.find('#age').prop('readonly', value);
    deleteFormId.find('#password').prop('readonly', value);
    deleteFormId.find('#Roles').prop('disabled', value);
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

$('#addButton').click(() => {
    insertUser();
    userAddFormId.find('#name').val('');
    userAddFormId.find('#surname').val('');
    userAddFormId.find('#age').val('');
    userAddFormId.find('#password').val('');
});

$('#newUserLink').click(() => {
    userAddFormId.find('#password').removeClass('alert alert-danger');
    userAddFormId.find('#password').removeAttr('placeholder');

    fetch('/api/v1/admin/roles').then(function (response) {
        if (response.ok) {
            userAddFormId.find('#newRoles').empty();
            response.json().then(roleList => {
                roleList.forEach(role => {
                    userAddFormId.find('#newRoles')
                        .append($('<option>')
                            .val(role.id).text(role.name));
                });
            });
        } else {
            console.error('Network request for roles.json failed with response ' + response.status + ': ' + response.statusText);
        }
    });
});

$('#tableLink').click(() => {
    getAllUsers();
});

$(document).ready(
    () => {
        getAllUsers();
    }
);




// $(async function() {
//     await allUsers();
// });
// const table = $('#tallUserTable');
// async function allUsers() {
//     table.empty()
//     fetch("http://localhost:8080/api/v1/admin")
//         .then(res => res.json())
//         .then(data => {
//             data.forEach(user => {
//                 let tableWithUsers = `$(
//                         <tr>
//                             <td>${user.id}</td>
//                             <td>${user.name}</td>
//                             <td>${user.surname}</td>
//                             <td>${user.age}</td>
//                             <td>${user.roles.map(role => " " + role.name.substring(5))}</td>
//                             <td>
//                                 <button type="button" class="btn btn-info" data-toggle="modal" id="buttonEdit"
//                                 data-action="edit" data-id="${user.id}" data-target="#edit">Edit</button>
//                             </td>
//                             <td>
//                                 <button type="button" class="btn btn-danger" data-toggle="modal" id="buttonDelete"
//                                 data-action="delete" data-id="${user.id}" data-target="#delete">Delete</button>
//                             </td>
//                         </tr>)`;
//                 table.append(tableWithUsers);
//             })
//         })
// }
//
// $(async function() {
//     await thisUser();
// });
// async function thisUser() {
//     fetch("http://localhost:8080/api/v1/admin/viewUser")
//         .then(res => res.json())
//         .then(data => {
//             // Добавляем информацию в шапку
//             $('#headerUsername').append(data.username);
//             let roles = data.roles.map(role => " " + role.name.substring(5));
//             $('#headerRoles').append(roles);
//
//             //Добавляем информацию в таблицу
//             let user = `$(
//             <tr>
//                 <td>${data.id}</td>
//                 <td>${data.name}</td>
//                 <td>${data.surname}</td>
//                 <td>${data.age}</td>
//                 <td>${roles}</td>)`;
//             $('#userPanelBody').append(user);
//         })
// }
//
//
//
//
//
// $('#edit').on('show.bs.modal', ev => {
//     let button = $(ev.relatedTarget);
//     let id = button.data('id');
//     showEditModal(id);
// })
//
// async function showEditModal(id) {
//     let user = await getUser(id);
//     let form = document.forms["formEditUser"];
//     form.id.value = user.id;
//     form.name.value = user.name;
//     form.surname.value = user.surname;
//     form.age.value = user.age;
//     form.password.value = user.password;
//
//     // $('#rolesEditUser').empty();
//
//     await fetch("http://localhost:8080/api/v1/admin/roles")
//         .then(res => res.json())
//         .then(roles => {
//             roles.forEach(role => {
//                 let selectedRole = false;
//                 for (let i = 0; i < user.roles.length; i++) {
//                     if (user.roles[i].name === role.name) {
//                         selectedRole = true;
//                         break;
//                     }
//                 }
//                 let el = document.createElement("option");
//                 el.text = role.name.substring(5);
//                 el.value = role.id;
//                 if (selectedRole) el.selected = true;
//                 $('#rolesEditUser')[0].appendChild(el);
//             })
//         })
// }
//
// $(async function() {
//     editUser();
//
// });
// function editUser() {
//     const editForm = document.forms["formEditUser"];
//     editForm.addEventListener("submit", ev => {
//         ev.preventDefault();
//         let editUserRoles = [];
//         for (let i = 0; i < editForm.roles.options.length; i++) {
//             if (editForm.roles.options[i].selected) editUserRoles.push({
//                 id : editForm.roles.options[i].value,
//                 name : "ROLE_" + editForm.roles.options[i].text
//             })
//         }
//
//         fetch("http://localhost:8080/api/v1/admin/" + editForm.id.value, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 id: editForm.id.value,
//                 name: editForm.name.value,
//                 surname: editForm.surname.value,
//                 age: editForm.age.value,
//                 password: editForm.password.value,
//                 roles: editUserRoles
//             })
//         }).then(() => {
//             $('#editFormCloseButton').click();
//             allUsers();
//         })
//     })
// }
//
// $(async function() {
//     await newUser();
// });
// async function newUser() {
//     await fetch("http://localhost:8080/api/roles")
//         .then(res => res.json())
//         .then(roles => {
//             roles.forEach(role => {
//                 let el = document.createElement("option");
//                 el.text = role.name.substring(5);
//                 el.value = role.id;
//                 $('#newUserRoles')[0].appendChild(el);
//             })
//         })
//
//     const form = document.forms["formNewUser"];
//
//     form.addEventListener('submit', addNewUser)
//
//     function addNewUser(e) {
//         e.preventDefault();
//         let newUserRoles = [];
//         for (let i = 0; i < form.roles.options.length; i++) {
//             if (form.roles.options[i].selected) newUserRoles.push({
//                 id : form.roles.options[i].value,
//                 name : form.roles.options[i].name
//             })
//         }
//         fetch("http://localhost:8080/api/v1/admin", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 name: form.name.value,
//                 surname: form.surname.value,
//                 age: form.age.value,
//                 password: form.password.value,
//                 roles: newUserRoles
//             })
//         }).then(() => {
//             form.reset();
//             allUsers();
//             $('#allUsersTable').click();
//         })
//     }
// }
//
// $('#delete').on('show.bs.modal', ev => {
//     let button = $(ev.relatedTarget);
//     let id = button.data('id');
//     showDeleteModal(id);
// })
//
// async function showDeleteModal(id) {
//     let user = await getUser(id);
//     let form = document.forms["formDeleteUser"];
//     form.id.value = user.id;
//     form.firstName.value = user.firstName;
//     form.lastName.value = user.lastName;
//     form.age.value = user.age;
//     form.username.value = user.username;
//
//
//     $('#rolesDeleteUser').empty();
//
//     await fetch("http://localhost:8080/api/roles")
//         .then(res => res.json())
//         .then(roles => {
//             roles.forEach(role => {
//                 let selectedRole = false;
//                 for (let i = 0; i < user.roles.length; i++) {
//                     if (user.roles[i].name === role.name) {
//                         selectedRole = true;
//                         break;
//                     }
//                 }
//                 let el = document.createElement("option");
//                 el.text = role.name.substring(5);
//                 el.value = role.id;
//                 if (selectedRole) el.selected = true;
//                 $('#rolesDeleteUser')[0].appendChild(el);
//             })
//         });
// }
// async function getUser(id) {
//     let url = "http://localhost:8080/api/v1/admin/" + id;
//     let response = await fetch(url);
//     return await response.json();
// }
//
// $(async function() {
//
//     deleteUser();
// });
// function deleteUser(){
//     const deleteForm = document.forms["formDeleteUser"];
//     deleteForm.addEventListener("submit", ev => {
//         ev.preventDefault();
//         fetch("http://localhost:8080/api/v1/admin/" + deleteForm.id.value, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then(() => {
//                 $('#deleteFormCloseButton').click();
//                 allUsers();
//             })
//     })
// }