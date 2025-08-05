import { LucideIcon } from "lucide-react";
import { HTMLAttributes } from "react";

import { IconRenderer } from "../../services/IconRenderer";
import "./styles.css";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  size?: "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  scheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
};

/**
 * Componente Badge - usado para exibir rótulos, status e categorizações
 *
 * @param args - Propriedades do componente Badge
 * @param args.size - Tamanho do badge. Padrão: "md"
 * @param args.variant - Variante visual do badge. Padrão: "ghost"
 * @param args.scheme - Esquema de cores do badge. Padrão: "primary"
 * @param args.leftIcon - Ícone opcional a ser exibido à esquerda
 * @param args.rightIcon - Ícone opcional a ser exibido à direita
 * @param args.rest - Outras propriedades HTML válidas para div
 *
 * @returns Elemento JSX do badge
 *
 * @example
 * ```tsx
 * // Badge básico
 * <Badge>Novo</Badge>
 *
 * // Badge com esquema de cores
 * <Badge scheme="success">Aprovado</Badge>
 *
 * // Badge com ícones
 * <Badge leftIcon={CheckIcon} scheme="success">
 *   Concluído
 * </Badge>
 *
 * // Badge personalizado
 * <Badge
 *   size="lg"
 *   variant="solid"
 *   scheme="warning"
 *   rightIcon={AlertIcon}
 * >
 *   Atenção
 * </Badge>
 * ```
 */

function Badge(args: BadgeProps) {
  const {
    variant = "ghost",
    scheme = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    className: baseClassName = "",
    children,
    ...rest
  } = args;

  const iconSizes = { md: 12, lg: 14 };
  const iconSize = iconSizes[size];

  const className = `arkynBadge ${variant} ${scheme} ${size} ${baseClassName}`;

  return (
    <div className={className.trim()} {...rest}>
      <IconRenderer iconSize={iconSize} Icon={leftIcon} />
      {children}
      <IconRenderer iconSize={iconSize} Icon={rightIcon} />
    </div>
  );
}

export { Badge };
