function submitenter(myfield,e)
{
    var keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    else return true;

    // If the key pressed is enter, submit a form
    if (keycode == 13) {
        //myfield.form.submit();
        return false;
    } else
       return true;
}