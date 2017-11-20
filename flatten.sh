#!/usr/bin/env bash
solidity_flattener --solc-paths="..=.." --output GoldeaSale.sol contracts/goldea/GoldeaSale.sol
solidity_flattener --solc-paths="..=.." --output GoldeaBounty.sol contracts/goldea/GoldeaBounty.sol