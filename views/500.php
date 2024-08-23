<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Puyo Nexus - Server trouble</title>

	<link rel="stylesheet" href="/errors/error.css">
</head>
<body>
	<!-- Oh the great Internet Explorer, why do I need to make my error pages at least 512 bytes in length for you to show them? -->
	<div id="wrap">
		<img src="/errors/500.png" alt="You broke our server.">
		<h1>Hang on... We're on it!</h1>
		<h2>Even though you probably broke our server.</h2>
		<p>Error: <?= htmlspecialchars($description) ?></p>
		<a href="/">Head back home</a>
	</div>
</body>
</html>
