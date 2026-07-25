{
  description = "portfolio-nuevo — Node/pnpm toolchain via Nix flakes";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        # corepack enable cannot symlink into the immutable Nix store.
        # This shim runs `corepack pnpm` with a writable COREPACK_HOME so the
        # packageManager field in package.json (pnpm@10.14.0) is respected.
        pnpm = pkgs.writeShellScriptBin "pnpm" ''
          export COREPACK_HOME="''${COREPACK_HOME:-$HOME/.cache/node/corepack}"
          mkdir -p "$COREPACK_HOME"
          exec ${pkgs.corepack}/bin/corepack pnpm "$@"
        '';

        nodeToolchain = [
          pkgs.nodejs_22
          pkgs.corepack
          pnpm
        ];

        ciScript = pkgs.writeShellApplication {
          name = "portfolio-ci";
          runtimeInputs = nodeToolchain;
          text = ''
            set -euo pipefail
            pnpm install --frozen-lockfile
            pnpm lint
            pnpm build
          '';
        };
      in
      {
        # nix develop  →  Node 22 + pnpm (via corepack, version from package.json)
        devShells.default = pkgs.mkShell {
          packages = nodeToolchain ++ [
            pkgs.nixfmt
          ];
          shellHook = ''
            echo "portfolio-nuevo · node $(node -v) · pnpm via corepack (see packageManager in package.json)"
          '';
        };

        # nix run .#ci  →  install + lint + build
        apps.ci = {
          type = "app";
          program = "${ciScript}/bin/portfolio-ci";
        };

        packages.ci = ciScript;

        formatter = pkgs.nixfmt;
      }
    );
}
