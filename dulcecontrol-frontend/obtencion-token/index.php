<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$curl = curl_init();

	curl_setopt_array($curl, array(
		CURLOPT_URL => 'http://pasteleria.spring.informaticapp.com:2250/api/v1/auth/login',
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => 'POST',
		CURLOPT_POSTFIELDS => json_encode([
			"correo" => $_POST['correo'],
			"contrasena" => $_POST['contrasena']
		]),
		CURLOPT_HTTPHEADER => array(
			'Content-Type: application/json'
		),
	));

	$response = curl_exec($curl);

	curl_close($curl);
	$data1 = json_decode($response);
}
?>

<!DOCTYPE html>
<html lang="en">


<head>
	<meta charset="UTF-8">
	<title>Obtener Token - Dulce Control</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" crossorigin="anonymous">
	<!-- FontAwesome for icons -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="./styles.css">
</head>

<body>
	<div class="supercontainer">
		<div class="container py-5">
			<div class="row justify-content-center">
				<div class="col-12 col-md-8 col-lg-5">
					<div class="dulce-card card p-4">
						<div class="text-center mb-3">
							<span class="dulce-logo">🧁</span>
							<h1 class="dulce-title mt-2 mb-1">Dulce Control</h1>
							<div class="dulce-sub mb-2">Panadería & Pastelería SaaS</div>
							<div class="mb-3 text-muted" style="font-size:1.05rem;">Obtén tu token de acceso para la API</div>
						</div>
						<!-- ...existing code... -->
						<?php if ($_SERVER["REQUEST_METHOD"] == "POST") : ?>
							<div class="mb-4">
								<div class="dulce-label mb-1"><i class="fas fa-check-circle"></i> Access Token generado:</div>
								<div class="dulce-token-card p-2 mb-2">
									<?php echo isset($data1->accessToken) ? $data1->accessToken : 'No se recibió accessToken'; ?>
								</div>
							</div>
						<?php endif ?>
						<form method="post" class="mx-auto" style="max-width: 350px;">
							<div class="form-group mb-3">
								<label for="correo" class="dulce-label"><i class="fas fa-envelope"></i> Correo</label>
								<input type="text" id="correo" name="correo" placeholder="Correo" class="form-control dulce-input" required autocomplete="username">
							</div>
							<div class="form-group mb-4">
								<label for="contrasena" class="dulce-label"><i class="fas fa-lock"></i> Contraseña</label>
								<input type="password" id="contrasena" name="contrasena" placeholder="Contraseña" class="form-control dulce-input" required autocomplete="current-password">
							</div>
							<button type="submit" class="dulce-btn btn btn-block mb-2"><i class="fas fa-sign-in-alt"></i> Obtener Token</button>
						</form>
						<div class="text-center mt-3" style="font-size:0.95rem;color:#888;">
							<i class="fas fa-info-circle"></i> Solo para desarrolladores registrados en la plataforma.
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container mt-4">
			<div class="bento-card card p-4">
				<div class="text-center mb-3">
					<span class="dulce-logo">🔑</span>
					<h5 class="mb-2" style="color:#7c3aed;font-weight:700;">Usuarios de Prueba Registrados</h5>
					<div class="mb-3 text-muted" style="font-size:1.02rem;">Utiliza cualquiera de estas credenciales para obtener tu token</div>
				</div>
				<div class="bento-row" tabindex="0" aria-label="Usuarios de prueba">

					<div class="bento-item">
						<div class="user-card">
							<div class="user-card-header">María Elena Rodríguez García</div>
							<div class="user-card-body">
								<div><span class="user-email">admin@dulcemanjar.pe</span></div>
								<div><strong>Contraseña:</strong> <span class="user-pass">demo123</span></div>
							</div>
						</div>
					</div>

					<div class="bento-item">
						<div class="user-card">
							<div class="user-card-header">Roberto Carlos Flores Díaz</div>
							<div class="user-card-body">
								<div><span class="user-email">admin@panaderiasol.pe</span></div>
								<div><strong>Contraseña:</strong> <span class="user-pass">demo123</span></div>
							</div>
						</div>
					</div>

					<div class="bento-item">
						<div class="user-card">
							<div class="user-card-header">Carmen Rosa Morales Castillo</div>
							<div class="user-card-body">
								<div><span class="user-email">admin@tortasdelicias.pe</span></div>
								<div><strong>Contraseña:</strong> <span class="user-pass">demo123</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Card con lista de endpoints (cargada desde endpoints.md) -->
		<div class="container mt-4">
			<div class="endpoints-card card p-4">
				<div class="text-center mb-3">
					<span class="dulce-logo">📡</span>
					<h5 class="mb-2" style="color:#7c3aed;font-weight:700;">Endpoints accesibles por token</h5>
					<div class="mb-3 text-muted" style="font-size:1.02rem;">Listado completo de endpoints para http://pasteleria.spring.informaticapp.com:2250/</div>
				</div>
				<div class="endpoints-list p-2">
					<?php
					// Robust search for endpoints.md: try current dir then walk up parent directories
					$mdPath = null;

					// 1) Walk up from this directory (up to 6 levels) looking for endpoints.md
					$searchDir = __DIR__;
					for ($i = 0; $i <= 6; $i++) {
						$candidate = $searchDir . '/endpoints.md';
						if (is_readable($candidate) && file_exists($candidate)) {
							$mdPath = $candidate;
							break;
						}
						$parent = dirname($searchDir);
						if ($parent === $searchDir) break;
						$searchDir = $parent;
					}

					// 2) Check a few likely backend resource locations if not found yet
					if (!$mdPath) {
						$possible = [
							__DIR__ . '/../dulcecontrol-backend/src/main/resources/endpoints.md',
							__DIR__ . '/../../dulcecontrol-backend/src/main/resources/endpoints.md',
							__DIR__ . '/../../../dulcecontrol-backend/src/main/resources/endpoints.md'
						];
						foreach ($possible as $p) {
							if (is_readable($p) && file_exists($p)) {
								$mdPath = $p;
								break;
							}
						}
					}

					// 3) Finally try the current working directory (in case the server's cwd is repo root)
					if (!$mdPath) {
						$cwdCandidate = getcwd() . '/endpoints.md';
						if (is_readable($cwdCandidate) && file_exists($cwdCandidate)) {
							$mdPath = $cwdCandidate;
						}
					}

					if ($mdPath) {
						$endpoints = file_get_contents($mdPath);
						echo '<pre><code>' . htmlspecialchars($endpoints) . '</code></pre>';
					} else {
						echo '<div class="text-danger">No se pudo encontrar endpoints.md en las rutas esperadas. Intenta colocar <code>endpoints.md</code> en el mismo directorio que este archivo o en la raíz del proyecto.</div>';
					}
					?>
				</div>
			</div>
		</div>
	</div>
</body>

</html>