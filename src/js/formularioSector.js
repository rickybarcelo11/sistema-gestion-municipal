export class FormularioSector {
    constructor() {
        this.modal = null;
        this.form = null;
        this.initializeModal();
    }

    initializeModal() {
        // Crear el modal
        this.modal = document.createElement('div');
        this.modal.className = 'modal-sector';
        this.modal.style.display = 'none';
        this.modal.style.position = 'fixed';
        this.modal.style.top = '0';
        this.modal.style.left = '0';
        this.modal.style.width = '100%';
        this.modal.style.height = '100%';
        this.modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        this.modal.style.zIndex = '1000';

        // Crear el contenido del modal
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#2d2d2d';
        modalContent.style.margin = '50px auto';
        modalContent.style.padding = '20px';
        modalContent.style.width = '80%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.borderRadius = '8px';

        // Crear el formulario
        this.form = document.createElement('form');
        this.form.id = 'sectorForm';

        // Campos del formulario
        const campos = [
            {
                label: 'Nombre del sector',
                type: 'text',
                name: 'nombre',
                required: true
            },
            {
                label: 'Tipo de tarea',
                type: 'select',
                name: 'tipoTarea',
                options: ['Poda', 'Corte de pasto', 'Recolección', 'Limpieza', 'Otro'],
                required: true
            },
            {
                label: 'Estado',
                type: 'select',
                name: 'estado',
                options: ['Pendiente', 'En progreso', 'Completado'],
                required: true
            },
            {
                label: 'Observaciones',
                type: 'textarea',
                name: 'observaciones',
                required: false
            },
            {
                label: 'Latitud',
                type: 'text',
                name: 'latitud',
                required: true,
                disabled: true
            },
            {
                label: 'Longitud',
                type: 'text',
                name: 'longitud',
                required: true,
                disabled: true
            }
        ];

        // Agregar campos al formulario
        campos.forEach(campo => {
            const div = document.createElement('div');
            div.style.marginBottom = '15px';

            const label = document.createElement('label');
            label.textContent = campo.label;
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.color = '#fff';

            let input;
            if (campo.type === 'select') {
                input = document.createElement('select');
                campo.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    input.appendChild(opt);
                });
            } else if (campo.type === 'textarea') {
                input = document.createElement('textarea');
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.type = campo.type;
            }

            input.name = campo.name;
            input.required = campo.required;
            input.disabled = campo.disabled || false;
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.borderRadius = '4px';
            input.style.border = '1px solid #444';
            input.style.backgroundColor = '#333';
            input.style.color = '#fff';

            div.appendChild(label);
            div.appendChild(input);
            this.form.appendChild(div);
        });

        // Botones
        const botones = document.createElement('div');
        botones.style.display = 'flex';
        botones.style.justifyContent = 'flex-end';
        botones.style.gap = '10px';
        botones.style.marginTop = '20px';

        const cancelar = document.createElement('button');
        cancelar.type = 'button';
        cancelar.textContent = 'Cancelar';
        cancelar.style.padding = '8px 16px';
        cancelar.style.borderRadius = '4px';
        cancelar.style.border = 'none';
        cancelar.style.backgroundColor = '#444';
        cancelar.style.color = '#fff';
        cancelar.style.cursor = 'pointer';
        cancelar.onclick = () => {
            this.cerrar();
            // Disparar evento de cancelación
            const event = new CustomEvent('sectorCancelado');
            document.dispatchEvent(event);
        };

        const guardar = document.createElement('button');
        guardar.type = 'submit';
        guardar.textContent = 'Guardar';
        guardar.style.padding = '8px 16px';
        guardar.style.borderRadius = '4px';
        guardar.style.border = 'none';
        guardar.style.backgroundColor = '#4CAF50';
        guardar.style.color = '#fff';
        guardar.style.cursor = 'pointer';

        botones.appendChild(cancelar);
        botones.appendChild(guardar);
        this.form.appendChild(botones);

        // Manejar el envío del formulario
        this.form.onsubmit = (e) => {
            e.preventDefault();
            if (this.validarFormulario()) {
                const datos = this.obtenerDatos();
                this.cerrar();
                // Disparar evento de guardado
                const event = new CustomEvent('sectorGuardado', { detail: datos });
                document.dispatchEvent(event);
                return datos;
            }
        };

        modalContent.appendChild(this.form);
        this.modal.appendChild(modalContent);
        document.body.appendChild(this.modal);
    }

    validarFormulario() {
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let valido = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4444';
                valido = false;
            } else {
                input.style.borderColor = '#444';
            }
        });

        if (!valido) {
            alert('Por favor complete todos los campos requeridos');
        }

        return valido;
    }

    obtenerDatos() {
        const formData = new FormData(this.form);
        const datos = {};
        formData.forEach((value, key) => {
            datos[key] = value;
        });
        return datos;
    }

    mostrar() {
        this.modal.style.display = 'block';
    }

    cerrar() {
        this.modal.style.display = 'none';
    }

    setCoordenadas(lat, lng) {
        this.form.querySelector('[name="latitud"]').value = lat;
        this.form.querySelector('[name="longitud"]').value = lng;
    }
} 