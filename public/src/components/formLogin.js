export function createForm(parentElement, pubSub) {
    
    return {
        render: function () {
            parentElement.innerHTML = `<div class="d-flex justify-content-center align-items-center">
                                <div class="card shadow-lg p-4" style="width: 22rem;">
                                    <h3 class="text-center mb-3">Login</h3>
                                    <form>
                                        <div class="mb-3">
                                            <label for="username" class="form-label">Username</label>
                                            <input type="text" class="form-control" id="username" name="username" required>
                                        </div>
                                        <button id="submit" type="button" class="btn btn-primary w-100">Submit</button>
                                    </form>
                                </div>
                            </div>`;

            document.getElementById("submit").onclick = async () => {
                const username = document.getElementById("username").value;
                pubSub.publish("isLogged", username);
                location.href = "#chat";
                document.getElementById("username").value = "";
            };
        }
    }
}