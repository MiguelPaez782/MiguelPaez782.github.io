// Check if it's first visit
        window.onload = function() {
            if (!localStorage.getItem('tutorialShown')) {
                showTutorial();
                localStorage.setItem('tutorialShown', 'true');
            }
        };

        function showTutorial() {
            document.getElementById('tutorialOverlay').classList.add('show');
            document.getElementById('tutorialModal').classList.add('show');
        }

        function closeTutorial() {
            document.getElementById('tutorialOverlay').classList.remove('show');
            document.getElementById('tutorialModal').classList.remove('show');
        }

        // Close tutorial when clicking overlay
        document.getElementById('tutorialOverlay').addEventListener('click', closeTutorial);

        function toggleTransporte() {
            const checkbox = document.getElementById('trabajaDesdeCasa');
            const transporteGroup = document.getElementById('transporteGroup');
            const transporteInput = document.getElementById('gastoTransporte');
            
            if (checkbox.checked) {
                transporteGroup.style.display = 'none';
                transporteInput.value = '0';
            } else {
                transporteGroup.style.display = 'block';
            }
        }

        function formatNumber(num) {
            return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function calcular() {
            // Obtener valores de ingresos y gastos personales
            const ingresoObjetivo = parseFloat(document.getElementById('ingresoObjetivo').value) || 0;
            const gastosPersonales = parseFloat(document.getElementById('gastosPersonales').value) || 0;

            // Obtener gastos operativos
            const trabajaDesdeCasa = document.getElementById('trabajaDesdeCasa').checked;
            const gastoTransporte = trabajaDesdeCasa ? 0 : (parseFloat(document.getElementById('gastoTransporte').value) || 0);
            const gastoHerramientas = parseFloat(document.getElementById('gastoHerramientas').value) || 0;
            const gastoSoftware = parseFloat(document.getElementById('gastoSoftware').value) || 0;
            const gastoInternet = parseFloat(document.getElementById('gastoInternet').value) || 0;
            const otrosGastos = parseFloat(document.getElementById('otrosGastos').value) || 0;

            // Obtener jornada laboral
            const horasDia = parseFloat(document.getElementById('horasDia').value) || 0;
            const diasSemana = parseFloat(document.getElementById('diasSemana').value) || 0;

            // Validaciones
            if (horasDia <= 0 || diasSemana <= 0) {
                alert('Por favor ingresa una jornada laboral válida (horas por día y días por semana).');
                return;
            }

            if (ingresoObjetivo <= 0) {
                alert('Por favor ingresa un ingreso objetivo válido.');
                return;
            }

            // Calcular totales
            const gastosOperativosTotales = gastoTransporte + gastoHerramientas + gastoSoftware + gastoInternet + otrosGastos;
            const gastosMensuales = gastosPersonales + gastosOperativosTotales;
            const ingresoNecesarioMensual = ingresoObjetivo + gastosMensuales;

            // Calcular horas mensuales (aproximadamente 4.33 semanas por mes)
            const horasSemana = horasDia * diasSemana;
            const horasMes = horasSemana * 4.33;

            // Calcular tarifas
            const tarifaPorHora = ingresoNecesarioMensual / horasMes;
            const tarifaSemanal = tarifaPorHora * horasSemana;

            // Mostrar resultados
            document.getElementById('tarifaHora').textContent = formatNumber(tarifaPorHora);
            document.getElementById('tarifaSemanal').textContent = formatNumber(tarifaSemanal);
            document.getElementById('ingresoNecesario').textContent = formatNumber(ingresoNecesarioMensual);

            // Crear desglose
            const desglose = [
                { concepto: 'Ingreso objetivo mensual', monto: ingresoObjetivo },
                { concepto: 'Gastos personales', monto: gastosPersonales },
                { concepto: 'Transporte', monto: gastoTransporte },
                { concepto: 'Herramientas y equipos', monto: gastoHerramientas },
                { concepto: 'Software y suscripciones', monto: gastoSoftware },
                { concepto: 'Internet y servicios', monto: gastoInternet },
                { concepto: 'Otros gastos operativos', monto: otrosGastos }
            ];

            const desgloseBody = document.getElementById('desgloseBody');
            desgloseBody.innerHTML = '';

            desglose.forEach(item => {
                if (item.monto > 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.concepto}</td>
                        <td style="text-align: right;">$${formatNumber(item.monto)}</td>
                    `;
                    desgloseBody.appendChild(row);
                }
            });

            // Agregar fila de total
            const totalRow = document.createElement('tr');
            totalRow.className = 'total-row';
            totalRow.innerHTML = `
                <td><strong>Total requerido mensual</strong></td>
                <td style="text-align: right;"><strong>$${formatNumber(ingresoNecesarioMensual)}</strong></td>
            `;
            desgloseBody.appendChild(totalRow);

            // Agregar información de horas
            const horasRow = document.createElement('tr');
            horasRow.innerHTML = `
                <td colspan="2" style="padding-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
                    <strong>Jornada:</strong> ${horasDia} horas/día × ${diasSemana} días/semana = ${horasSemana} horas/semana (≈${formatNumber(horasMes)} horas/mes)
                </td>
            `;
            desgloseBody.appendChild(horasRow);

            // Mostrar card de resultados
            document.getElementById('resultadosCard').classList.remove('hidden');

            // Scroll suave a resultados
            document.getElementById('resultadosCard').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }

        // Permitir calcular con Enter en los inputs
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calcular();
                }
            });
        });