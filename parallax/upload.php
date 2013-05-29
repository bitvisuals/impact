<?php

if( $_FILES['file']['type'] == 'image/png' && $_FILES['file']['size'] < 1000000 ){
    $itemNo = $_POST['itemNo'];
    if( $itemNo < 1 || $itemNo > 3 ) {
        $itemNo = 1;
    }
    move_uploaded_file(
        $_FILES['file']['tmp_name'],
        'img/bg' . $itemNo . '.png'
    );
} else {
    echo 'Invalid file';
}
