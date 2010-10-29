<?php

function send_json ($obj) {
    if (is_null($obj) || ($obj === false)) {
        return json_encode(false);
    }
    
    if (!is_array($obj)) {
        return json_encode(htmlentities($obj));
    }
    
    $return = array();
    
    foreach ($obj as $key=>$value) {
        $return[htmlentities($value)] = htmlentities($value);
    }
    
    return json_encode($return);
}

if ((isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') ||
    (isset($_GET['is_ajax']) && $_GET['is_ajax'] == 'Y')) {
    
    $options = array(
        'One level options' => array(
            'HTML',
            '(x)HTML',
            'CSS',
            'Javascript',
            'XML',
        ),
        
        'Two level options' => array(
            'Javascript frameworks',
            'CSS grid systems',
        ),
        
        'Javascript frameworks' => array(
            'jQuery',
            'MooTools',
            'Prototype',
            'YUI',
            'Glow',
            'Dojo',
            'ExtJS',
            'Raphael',
            'RightJS',
        );
        
        'CSS grid systems' => array(
            '1kb',
            '960',
            'Blueprint',
            'Golden grid',
            'Simple grid',
        );
        
        'No more options' => false,
    );
    
    header('Content-Type: text/json; charset=utf-8');
    exit(send_json($options[$_GET['caller']]));
}

?>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<head>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
<script type="text/javascript" src="ajaxSelect-0.2.js"></script>
<script type="text/javascript">
$(document).ready(function(){
    $('select').ajaxSelect({url:document.location.href}).trigger('change');
});
</script>
<style type="text/css">
div.still-loading
{display:inline-block;}
</style>
</head>
<body>
<form>
    <select name="category">
        <option value="No other options">No more options</option>
        <option value="One level options">One level options</option>
        <option value="Two level options">Two level options</option>
    </select>
</form>
</body>
</html>