<template>
    <div class="container">
        <div class="row mt-5">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">DamageDepth Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" data-toggle="modal" data-target="#addNew" @click="openModalWindow">Add New <i class="fas fa-depth-plus fa-fw"></i></button>
                </div>
              </div>
             
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Descripcion</th>
                        <th>Option</th>
                  </tr> 

                  <tr v-for="depth in depths" :key="depth.id">
                    <td>{{ depth.damagedepth }}</td>
                    <td>{{ depth.description }}</td>

                    <td>
                        <a href="#" data-id="depth.id" @click="editModalWindow(depth)">
                            <i class="fa fa-edit blue">Edit</i>
                        </a>
                        <a href="#" data-id="depth.id" @click="deleteDamageDepth(depth.damagedepth)">
                            <i class="fa fa-edit blue">Delete</i>
                        </a>

                    </td>
                  </tr>
                </tbody></table>
              </div>
            
              <div class="card-footer">
                 
              </div>
            </div>
           
          </div>
        </div>


            <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">

                    <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New DamageDepth</h5>
                    <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update DamageDepth</h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

<form @submit.prevent="editMode ? updateDamageDepth() : createDamageDepth()">
<div class="modal-body">
    <div class="form-group">
        <input v-model="form.damagedepth" type="text" name="damagedepth"
            placeholder="damagedepth"
            class="form-control" :class="{ 'is-invalid': form.errors.has('damagedepth') }">
        <has-error :form="form" field="damagedepth"></has-error>
    </div>
     <div class="form-group">
        <input v-model="form.description" type="text" name="description"
            placeholder="Description"
            class="form-control" :class="{ 'is-invalid': form.errors.has('description') }">
        <has-error :form="form" field="description"></has-error>
    </div>

</div>
<div class="modal-footer">
    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
    <button v-show="editMode" type="submit" class="btn btn-primary">Update</button>
    <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
</div>

</form>

                </div>
            </div>
            </div>
    </div>

</template>

<script>
import axios from 'axios';
    export default {
        data() {
            return {
                editMode: false,
                depths: {},
                form: new Form({
                    damagedepth: '',
                    description : '',

                })
            }
        },
        methods: {
        
        editModalWindow(depth){
           this.form.clear();
           this.editMode = true
           this.form.reset();
           $('#addNew').modal('show');
           this.form.fill(depth)
        },
        updateDamageDepth(){
           this.form.put('http://localhost:8080/damagedepth/'+this.form.damagedepth)
               .then(()=>{

                   Toast.fire({
                      icon: 'success',
                      title: 'DamageDepth updated successfully'
                    })

                    $('#addNew').modal('hide');
                    this.loadDamageDepths();
               })
               .catch(()=>{
                  console.log("Error.....");
                  $('#addNew').modal('hide');
                        this.loadDamageDepths();
               })
        },
        openModalWindow(){
           this.editMode = false
           this.form.reset();
           $('#addNew').modal('show');
        },

        loadDamageDepths() {

        axios.get("http://localhost:8080/damagedepths").then( data => {this.depths = data.data; console.log(data)});
        
          //pick data from controller and push it into depths object

        },

        createDamageDepth(){


            this.form.post('http://localhost:8080/damagedepth')
                .then(() => {
                   

                        Toast.fire({
                          icon: 'success',
                          title: 'DamageDepth created successfully'
                        })

                        $('#addNew').modal('hide');
                        this.loadDamageDepths();

                })
                .catch(() => {
                    Toast.fire({
                          icon: 'error',
                          title: 'DamageDepth not created'
                        })
                   console.log("Error......");
                   $('#addNew').modal('hide');
                        this.loadDamageDepths();
                })

     

            //this.loadDamageDepths();
          },
          deleteDamageDepth(id) {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                
              if (result.value) {
                //Send Request to server
                this.form.delete('http://localhost:8080/damagedepth/'+id)
                    .then((response)=> {
                            Swal.fire(
                              'Deleted!',
                              'DamageDepth deleted successfully',
                              'success'
                            )
                    this.loadDamageDepths();

                    }).catch(() => {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                          footer: '<a href>Why do I have this issue?</a>'
                        })
                    })
                }

            })
          }
        },

        created() { 
            axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token');
            this.loadDamageDepths();
        }
    }
</script> 