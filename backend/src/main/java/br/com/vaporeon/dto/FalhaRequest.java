package br.com.vaporeon.dto;

import br.com.vaporeon.model.Severidade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FalhaRequest(
        @NotBlank(message = "origem e obrigatoria")
        String origem,

        @NotBlank(message = "descricao e obrigatoria")
        @Size(max = 500, message = "descricao deve ter no maximo 500 caracteres")
        String descricao,

        @NotNull(message = "severidade e obrigatoria (BAIXA, MEDIA, ALTA ou CRITICA)")
        Severidade severidade
) {
}
