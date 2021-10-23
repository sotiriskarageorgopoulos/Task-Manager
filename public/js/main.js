$(document).ready(function () {
    $("#delete-btn").click(function () {
        let index = $(this).val()
        let inputName = "taskId" + index
        let data = {
            taskId: $(`input[name="${inputName}"]`).val()
        }
        $("#task"+index).remove()
        $.ajax({
                url: "http://localhost:8000/main",
                type: "DELETE",
                data: data
        })
    })
})