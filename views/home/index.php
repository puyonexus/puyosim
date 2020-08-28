<?php
	// Set the embed title and description
	$embedTitle = $title ?? $site['name'];
	$embedDescription = isset($title)
		? $site['titledChainDescription']
		: $site['description'];
?><!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns/article#">
<head>
	<meta charset="utf-8">
	<title><?php
		if (isset($title))
		{
			?><?= htmlspecialchars($title) ?> - <?php
		}
	?><?= htmlspecialchars($site['name']) ?></title>

	<meta name="description" content="<?= htmlspecialchars($site['description']) ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<meta property="og:type" content="article">
	<meta property="og:site_name" content="<?= htmlspecialchars($site['name']) ?>">
	<meta property="og:title" content="<?= htmlspecialchars($embedTitle) ?>">
	<meta property="og:description" content="<?= htmlspecialchars($embedDescription) ?>">
	<meta property="og:image" content="<?= htmlspecialchars($ogEmbedImage) ?>">
	<meta property="og:url" content="<?= htmlspecialchars($pageUrl) ?>">

	<meta property="twitter:card" content="summary">
	<meta property="twitter:site" content="<?= htmlspecialchars($site['twitter']) ?>">
	<meta property="twitter:title" content="<?= htmlspecialchars($embedTitle) ?>">
	<meta property="twitter:description" content="<?= htmlspecialchars($embedDescription) ?>">
	<meta property="twitter:image" content="<?= htmlspecialchars($embedImage) ?>">

	<?php
		if (isset($oEmbedUrl))
		{
			?><link rel="alternate" type="application/json+oembed" href="<?= htmlspecialchars($oEmbedUrl) ?>&amp;format=json" title="<?= htmlspecialchars($embedTitle) ?>">
			<link rel="alternate" type="text/xml+oembed" href="<?= htmlspecialchars($oEmbedUrl) ?>&amp;format=xml" title="<?= htmlspecialchars($embedTitle) ?>"><?php
		}
	?>

	<link rel="icon" href="/assets/images/favicon.ico">
	<link rel="apple-touch-icon-precomposed" href="/assets/images/apple-touch-icon-precomposed.png">

	<script>
		window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
		ga('create', 'UA-8256078-1', 'auto');
		ga('send', 'pageview');
	</script>
	<script async src="https://www.google-analytics.com/analytics.js"></script>

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="/assets/css/simulator.min.css">
</head>
<body data-base-path="<?= htmlspecialchars($basePath) ?>">
	<header id="pn-header">
		<nav id="pn-navbar">
			<div class="container">
				<h1 id="pn-navbar-brand">
					<a>PuyoSim</a>
				</h1>
				<button class="pn-navbar-toggle collapsed"><span class="pn-navbar-toggle-icon" aria-hidden="true"></span></button>
				<div class="pn-navbar-collapse collapse">
					<ul class="pn-nav">
						<li><a href="https://puyonexus.com/">Puyo Nexus</a></li>
						<li><a href="https://puyonexus.com/wiki/">Puyo Wiki</a></li>
					</ul>
				</div>
			</div>
		</nav>
	</header>
	<main id="content">
		<div class="container">
			<div id="simulator"></div>
		</div>
	</main>
	<footer id="pn-footer">
		<div class="container">
			<div class="copyright">
				<p>&copy; 2007-2020 Nick Woronekin and <a href="https://github.com/puyonexus/puyosim/graphs/contributors">contributors</a>.</p>
			</div>
			<ul class="footer-links">
				<li><a href="https://github.com/puyonexus/puyosim/">Github</a></li>
			</ul>
		</div>
	</footer>
	
	<script src="/assets/js/clipboard.min.js"></script>
	<script src="/assets/js/jquery.min.js"></script>
	<script src="/assets/js/simulator.min.js"></script>
	<?php
		if (isset($chainData))
		{
			?><script>window.chainData = <?= json_encode($chainData) ?>;</script><?php
		}
	?>
</body>
</html>