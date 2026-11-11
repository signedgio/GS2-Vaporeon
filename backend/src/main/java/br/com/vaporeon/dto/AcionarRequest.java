package br.com.vaporeon.dto;

import jakarta.validation.constraints.NotNull;

public record AcionarRequest(
        @NotNull(message = "ligar e obrigatorio (true para ligar, false para desligar)")
        Boolean ligar
) {
}