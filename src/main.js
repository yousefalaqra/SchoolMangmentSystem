

var students = [];

document.getElementById('submit').addEventListener('click', () => {
    let x = 20;
	let nameInputEl = document.getElementById('name');
	let idInputEl = document.getElementById('idNumber');
	let gdpaInputEl = document.getElementById('gdpa');

	// Validation for input
	inputValidation(nameInputEl.value, idInputEl.value, gdpaInputEl.value);

	// insert student
	insertStudent(nameInputEl.value, idInputEl.value, gdpaInputEl.value);

	// Show success message
	showMessage('success');

    
});

function inputValidation(name, id, gdpa) {
	// check for the value of each element
    let x = 30;

	if (name == '') {
		alert('Please insert the student name');
	}

	if (id == '') {
		alert('Please insert the student id number');
	}

	if (gdpa == '') {
		alert('Please insert the student gdpa');
	}
}

function insertStudent(Name, Id, Gdpa) {
	let student = {
		name: Name,
		id: Id,
		gdpa: Gdpa,
	};
	students.push(student);
    console.log('students array: ', students);
}

function showMessage(event){
    if (event == 'success') {
        alert('Studnet added!')
    }else{
        alert('Faild to add student')
    }
}

// Show list of students 
function print(){

	var output = '';

    for (var i in students) {
        var student = [];

        for (var Propertie in students[i]) {
            student.push(Propertie + ': ' + students[i][Propertie]);
        }

        output += "<li>" + student.join('<br>') + "</li>";
    }

	document.getElementById("names").innerHTML = "<ol>" + output + "</ol>";
}

// Delete student
function Delete() {

	let deleteStu = document.getElementById("idDelete").value;

	for(var i in students) {

		if(students[i]["id"] == deleteStu){
		 students.splice(i,1);
		 alert("student has deleted");
		 return;	
	    }   	
    } 
  alert("student not fiond");
}

// Update student
var index = -1;
function check(){
	let isFound = document.getElementById("idToUpdate").value;

	for(var i in students) {
		if(students[i]["id"] == isFound){	 
		 index = i;
		 document.getElementById("show").style.display = 'block';
		 return;	
		}
    }
	alert("student is not Found");
    index = -1;
}

function Update() {
	let name = document.getElementById('UpdateName').value;
	let id = document.getElementById('UpdateId').value;
	let gdpa = document.getElementById('UpdateGdpa').value;
       
   console.log(name);
   console.log(id);
   console.log(gdpa);
   console.log(index);

   if(index != -1){

    if(name != '')
	students[index]["name"] = name;

	if(id != '')
	students[index]["id"] = id;

	if(gdpa != '')
	students[index]["gdpa"] = gdpa;
    alert("student Update");
   }
   alert("student is not Update");
}

// This week task:
// Show list of students 
// Update student
// Delete student

// 10 marks
// 1) based on the follwoing:
// a) easy to use  and prettyu look 3
// b) resposnive design 2

// c) clean code 2
// d) show list for the user 1
// e) update 1
// f) delete 1

// Deeadline: 20/2, on github.
