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

	<link rel="stylesheet" href="/assets/css/common.css">
	<link rel="stylesheet" href="<?= htmlspecialchars($assetsPath) ?>/css/font-awesome.min.css">
	<link rel="stylesheet" href="<?= htmlspecialchars($assetsPath) ?>/css/simulator.css">
</head>
<body data-base-path="<?= htmlspecialchars($basePath) ?>" data-assets-path="<?= htmlspecialchars($assetsPath) ?>">
	<header id="pn-header">
		<nav id="pn-navbar">
			<div class="container">
				<h1 id="pn-navbar-brand">
					<a href="/">Puyo Nexus</a>
				</h1>
				<button class="pn-navbar-toggle collapsed"><span class="pn-navbar-toggle-icon" aria-hidden="true"></span></button>
				<div class="pn-navbar-collapse collapse">
					<ul class="pn-nav">
						<li><a href="/wiki/">Wiki</a></li>
						<li><a href="/forum/">Forum</a></li>
						<li class="active"><a href="/chainsim/">Chain Simulator</a></li>
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
				<p>&copy; 2007-2017 Puyo Nexus</p>
			</div>
			<ul class="footer-links">
				<li><a href="https://github.com/puyonexus/puyosim/">Github</a></li>
			</ul>
		</div>
	</footer>

	<script src="/assets/js/common.min.js"></script>
	<script src="<?= htmlspecialchars($assetsPath) ?>/js/clipboard.min.js"></script>
	<script src="<?= htmlspecialchars($assetsPath) ?>/js/jquery.min.js"></script>
	<script src="<?= htmlspecialchars($assetsPath) ?>/js/simulator.min.js"></script>
	<?php
		if (isset($chainData))
		{
			?><script>window.chainData = <?= json_encode($chainData) ?>;</script><?php
		}
	?>
</body>
</html>
