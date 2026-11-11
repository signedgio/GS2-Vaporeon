package br.com.vaporeon.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record LeituraRequest(
        @NotNull(message = "nivelReservatorio e obrigatorio")
        @DecimalMin(value = "0.0", message = "nivelReservatorio deve ser >= 0")
        @DecimalMax(value = "100.0", message = "nivelReservatorio deve ser <= 100")
        Double nivelReservatorio,

        @NotNull(message = "vazao e obrigatoria")
        @DecimalMin(value = "0.0", message = "vazao deve ser >= 0")
        Double vazao,

        @NotNull(message = "consumoEletrico e obrigatorio")
        @DecimalMin(value = "0.0", message = "consumoEletrico deve ser >= 0")
        Double consumoEletrico
) {
}