// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.
import { Rule } from 'publicodes'
import { Names } from './dist/names'

export type DottedNames = Names
declare let rules: Record<Names, Rule>

export default rules
